const { isConstructor, lowerCaseFirstLetter } = require('../helpers');
const cwd = process.cwd();
const ENTITY_CACHE = {};

class Base {
    constructor() {

    }

    static build(context, dependencies) {
        let dependencyNames, dependencyClass, dependency, reference;
        // for every dependency type (Service, Controller...)
        for (let dependencyType in dependencies) {
            dependencyNames = dependencies[dependencyType];
            // for every dependency name (AccountService, AccountController...)
            for (let dependencyName of dependencyNames) {
                // get the class
                reference = Base.getEntityClass(dependencyType, dependencyName);
                if (isConstructor(reference)) {
                    // instantiate an object
                    dependency = new reference();
                }else dependency = reference;
                // set it to the context instance
                context[lowerCaseFirstLetter(dependencyName)] = dependency;
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