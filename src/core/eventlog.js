import orbitdb from './orbitdb';
import config from '../config';

export default async (setup) => {
    const db = await orbitdb.log(config.eventlog.name, config.eventlog.options);
    if (setup) {
        setup(db);
    }

    await db.load();
    return db;
}



