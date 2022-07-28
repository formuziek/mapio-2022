import { Version } from "../static/versions";
import { AdministrativeCodes, AdministrativeCodes2021 } from "../static/administrativeCodes";

let DataLogic = {
    /*
    * Builds a query based on dataset.
    */
    buildQuery(version, dataset, year, quarter) {
        const queryRoot = {
            Query: [],
            Response: {
                Format: 'json',
            },
        };

        for (let i = 0; i < dataset.QuerySections.length; i++) {
            const section = dataset.QuerySections[i];
            const sectionValues = [];
            let sectionCode = "";
            switch (section) {
                case "AREA":
                    if (version === Version.AFTER_2021_ATR) {
                        for (var key in AdministrativeCodes2021) {
                            sectionValues.push(key);
                        }
                    } else if (version === Version.BEFORE_2021_ATR) {
                        for (var key in AdministrativeCodes) {
                            sectionValues.push(key);
                        }
                    }
                    break;
                case "TIME":
                    sectionValues.push(year);
                    break;
                default:
                    sectionValues.push(...dataset.QueryValues[i])
                    break;
            }
            const queryItem = {
                Code: section,
                Selection: {
                    Filter: 'item',
                    Values: sectionValues,
                },
            };
            queryRoot.Query.push(queryItem);
        }

        return queryRoot;
    },
}

export default DataLogic;
