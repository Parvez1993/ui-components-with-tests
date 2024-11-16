module.exports = {
    presets: [
        '@babel/preset-env',   // Transpile modern JavaScript
        '@babel/preset-react', // Transform JSX syntax
    ], plugins: [
        '@babel/plugin-transform-runtime'  // Add this plugin if needed
    ],
};