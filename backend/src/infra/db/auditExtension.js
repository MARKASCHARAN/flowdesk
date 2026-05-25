import { requestContext } from '../../api/middlewares/context.js';

/**
 * Prisma Audit Logging Extension
 * 
 * Industry standard: Automatically tracks 'before' and 'after' state differences
 * for any mutated entity in the database by utilizing Prisma Client Extensions 
 * and Node's AsyncLocalStorage to infer the acting User and Tenant context.
 */
export const auditExtension = (basePrisma) => basePrisma.$extends({
  query: {
    $allModels: {
      async update({ model, operation, args, query }) {
        const store = requestContext?.getStore();
        const userId = store?.get('userId');
        const tenantId = store?.get('tenantId');

        // Do not audit internal tables or if no context is present (like background jobs)
        if (!userId || !tenantId || ['AuditLog', 'Session', 'Notification', 'WebhookEvent'].includes(model)) {
          return query(args);
        }

        try {
          // 1. Fetch the before state using a separate internal query to avoid loops
          const before = await basePrisma[model].findFirst({ where: args.where });
          if (!before) return query(args);
          
          // 2. Perform the update
          const after = await query(args);

          // 3. Calculate Diff
          const diff = {};
          if (args.data) {
            for (const key of Object.keys(args.data)) {
              if (before[key] !== after[key] && key !== 'updatedAt') {
                diff[key] = { from: before[key], to: after[key] };
              }
            }
          }

          // 4. Save audit log asynchronously if there are changes
          if (Object.keys(diff).length > 0) {
            basePrisma.auditLog.create({
              data: {
                tenantId,
                userId,
                action: 'update',
                resourceType: model,
                resourceId: after.id || 'unknown',
                metadata: { diff }
              }
            }).catch(e => console.error('AuditLog Extension Error:', e));
          }

          return after;
        } catch (error) {
          // Fallback to normal execution if something fails
          return query(args);
        }
      },

      async delete({ model, operation, args, query }) {
        const store = requestContext?.getStore();
        const userId = store?.get('userId');
        const tenantId = store?.get('tenantId');

        if (!userId || !tenantId || ['AuditLog', 'Session', 'Notification', 'WebhookEvent'].includes(model)) {
          return query(args);
        }

        const deletedRecord = await query(args);
        
        basePrisma.auditLog.create({
          data: {
            tenantId,
            userId,
            action: 'delete',
            resourceType: model,
            resourceId: deletedRecord.id || 'unknown',
            metadata: { deleted: true }
          }
        }).catch(e => console.error('AuditLog Extension Error:', e));

        return deletedRecord;
      }
    }
  }
});
