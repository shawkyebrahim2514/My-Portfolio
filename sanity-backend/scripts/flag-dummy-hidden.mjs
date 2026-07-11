import { getCliClient } from 'sanity/cli';

// One-off: flag every seeded [DUMMY] Hub entry as hidden-in-production so they
// stay in the dataset as reference material but drop out of the live site's
// listings (still reachable locally and via ?preview=1).
const client = getCliClient({ apiVersion: '2023-01-01' });

const run = async () => {
    const dummies = await client.fetch(
        `*[_type=="hubEntry" && title match "[DUMMY]*"]{_id, title}`,
    );
    if (dummies.length === 0) {
        console.log('No [DUMMY] entries found.');
        return;
    }
    console.log(`Flagging ${dummies.length} dummy entries as hidden:`);
    let tx = client.transaction();
    for (const doc of dummies) {
        console.log(`  - ${doc._id}  ${doc.title}`);
        tx = tx.patch(doc._id, (p) => p.set({ hiddenInProduction: true }));
    }
    await tx.commit();
    console.log('Done.');
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
