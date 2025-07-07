import userRoutes from 'api/Users/index.routes';
import scoreRoutes from 'api/Scores/index.routes';

const validateRouteHandlers = (route) => {

    for (let index = 0; index < route.handlers.length; index += 1) {

        const currentHandler = route.handlers[index];
        if (typeof currentHandler !== 'function') {

            throw new Error(`On ${route.path}, handler ${index} must be a function`);

        }

    }

};

const mountRoutes = (app, routesTree) =>

    routesTree.forEach((routesContext) => {

        routesContext.forEach((route) => {

            const method = (route.method === 'DEL')
                ? 'delete'
                : route.method.toLowerCase();

            validateRouteHandlers(route);

            app[method](route.path, ...route.handlers);

        });

    });

const run = (app) => {

    mountRoutes(app, [
        userRoutes,
        scoreRoutes
    ]);

};

module.exports = { run };
