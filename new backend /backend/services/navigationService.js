const navigation = require("../navigation/navigation.json");

function findNavigation(question) {

    const q = question.toLowerCase();

    for (const feature of navigation) {

        for (const alias of feature.aliases) {

            if (q.includes(alias.toLowerCase())) {

                return feature;

            }

        }

    }

    return null;

}

module.exports = { findNavigation };
