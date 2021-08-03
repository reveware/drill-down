const {
    disableEsLint,
    override,
    removeModuleScopePlugin
} = require("customize-cra");


/*
https://stackoverflow.com/questions/50908913/how-do-i-get-create-react-app-to-compile-code-outside-src
create-react-app doesn't allow you to import modules from outside the \src folder without eject 🤷‍♂️
so, in order to bring in the interfaces, this became a monorepo using yarn workspaces, bypassing CRA,
but now the webpack loader here: /node_modules/react-scripts/config/webpack.config.js needs tweaks.
kudos @lukasbach
 */
const removeIncludeRestrictionFromTsLoader = () => config => {
    // This object contains the rules for the babel's file processing loaders
    const oneOfObject = config.module.rules.find(rule => !!rule.oneOf);

    if (!oneOfObject) {
        console.error("Could not find oneOf object");
        console.log(config.module.rules);
        return config;
    }

    // The tsLoader is one where the "test" argument is a regex targeting tx files
    const tsLoader = oneOfObject.oneOf.find(rule => rule.test && rule.test.toString() === /\.(js|mjs|jsx|ts|tsx)$/.toString());

    if (tsLoader) {
        delete tsLoader.include;
    }

    return config;
};


module.exports = override(
    disableEsLint(),
    removeIncludeRestrictionFromTsLoader(), // should not be required because of babelInclude
    removeModuleScopePlugin(),
);