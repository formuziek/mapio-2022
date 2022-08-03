import { Version } from "../static/versions";
import { AdministrativeCodes, AdministrativeCodes2021 } from "../static/administrativeCodes";

let DataLogic = {
    /*
    * Builds a query based on dataset.
    */
    buildQuery(version, dataset) {
        const queryRoot = {
            Query: [],
            Response: {
                Format: 'json',
            },
        };

        for (let i = 0; i < dataset.Variables.length; i++) {
            const variable = dataset.Variables[i];
            const value = [];
            switch (variable.Code) {
                case "AREA":
                    if (version === Version.AFTER_2021_ATR) {
                        for (var key in AdministrativeCodes2021) {
                            value.push(key);
                        }
                    } else if (version === Version.BEFORE_2021_ATR) {
                        for (var key in AdministrativeCodes) {
                            value.push(key);
                        }
                    }
                    break;
                case "ContentsCode":
                    value.push(variable.ValueItems[0].Value);
                    break;
                default:
                    value.push(variable.value.Value);
                    break;
            }
            const queryItem = {
                Code: variable.Code,
                Selection: {
                    Filter: 'item',
                    Values: value,
                },
            };
            queryRoot.Query.push(queryItem);
        }

        return queryRoot;
    },
}

export default DataLogic;
