const cwd = process.cwd();
const ENTITY_CACHE = {};

class Base {
    constructor() {

    }

    static build(context, dependencies) {
        let dependencyNames, dependencyClass, dependency;
        // for every dependency type (Service, Controller...)
        for(let dependencyType in dependencies){
            console.log('dependencyType', dependencyType);
            dependencyNames = dependencies[dependencyType];
            // for every dependency name (AccountService, AccountController...)
            for(let dependencyName of dependencyNames){
                console.log('dependencyName', dependencyName);
                // get the class
                dependencyClass = Base.getEntityClass(dependencyType, dependencyName);
                // instantiate an object
                dependency = new dependencyClass();
                // call dependency build()
                // if('build' in dependency) dependency.build();
                // set it to the context instance
                context[dependencyName] = dependency;
            }
        }
    }

    static getEntityClass(type, name) {
        const path = `${cwd}/api/${type}/${name}`;
        let entity = null;
        if (path in ENTITY_CACHE) {
            entity = ENTITY_CACHE[path];
        } else {
            entity = require(path);
            ENTITY_CACHE[path] = entity;
        }

        return entity
    }
}

module.exports = Base;