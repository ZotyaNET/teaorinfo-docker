function getEnvVariable(envVar, defaultValue) {
    var command = run("sh", "-c", `printenv --null ${ envVar } >/tmp/${ envVar }.txt`);
    // note: 'printenv --null' prevents adding line break to value
    if (command !== 0) return defaultValue;
    return cat(`/tmp/${ envVar }.txt`)
}
// create application user and collection
var dbUser = getEnvVariable('DB_USERNAME', 'nace');
var dbPwd = getEnvVariable('DB_PASSWORD', 'secret');
var dbName = getEnvVariable('DB_DATABASE', 'nace');
var dbCollectionName = getEnvVariable('DB_COLLECTION_NAME', 'Urls');
db = db.getSiblingDB(dbName);
db.createUser({
    'user': dbUser,
    'pwd': dbPwd,
    'roles': [
        {
            'role': 'dbOwner',
            'db': getEnvVariable('DB_DATABASE', 'MeanUrls')
        }
    ]
});
db.createCollection(dbCollectionName);