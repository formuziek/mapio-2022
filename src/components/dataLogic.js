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

        dataset.QuerySections.forEach(section => {
            const sectionValues = [];
            let sectionCode = "";
            switch (section) {
                case "Teritoriālā vienība":
                case "Administratīvā teritorija":
                    if (version === Version.AFTER_2021_ATR) {
                        for (var key in AdministrativeCodes2021) {
                            sectionValues.push(key);
                        }
                    } else if (version === Version.BEFORE_2021_ATR) {
                        for (var key in AdministrativeCodes) {
                            sectionValues.push(key);
                        }
                    }
                    sectionCode = "AREA";
                    break;
                case "Gads":
                    sectionValues.push(year);
                    sectionCode = "TIME";
                    break;
                case "Gads/Ceturksnis":
                    sectionValues.push(`${year}${quarter}`);
                    sectionCode = "TIME";
                    break;
                default:
                    sectionValues.push(...dataset.QueryValues[dataset.QuerySections.indexOf(section)]);
                    sectionCode = "INDICATOR";
                    break;
            }
            const queryItem = {
                Code: sectionCode,
                Selection: {
                    Filter: 'item',
                    Values: sectionValues,
                },
            };
            queryRoot.Query.push(queryItem);
        });

        return queryRoot;
    },
}

export default DataLogic;
