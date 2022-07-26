let dataLogic = {
    /*
    * Builds a query based on dataset.
    */
    buildQuery(dataset, year, quarter) {
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
                    for (var key in AdministrativeCodes) {
                        sectionValues.push(key);
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

export default dataLogic;

const AdministrativeCodes = {
    LV0010000 : 0,
    LV0050000 : 1,
    LV0090000 : 2,
    LV0110000 : 3,
    LV0130000 : 4,
    LV0170000 : 5,
    LV0210000 : 6,
    LV0250000 : 7,
    LV0270000 : 8,
    LV0604300 : 9,
    LV0320200 : 10,
    LV0640600 : 11,
    LV0560800 : 12,
    LV0661000 : 13,
    LV0624200 : 14,
    LV0360200 : 15,
    LV0424701 : 16,
    LV0360800 : 17,
    LV0460800 : 18,
    LV0804400 : 19,
    LV0804900 : 20,
    LV0800600 : 21,
    LV0384400 : 22,
    LV0380200 : 23,
    LV0400200 : 24,
    LV0964700 : 25,
    LV0840601 : 26,
    LV0967101 : 27,
    LV0805200 : 28,
    LV0700800 : 29,
    LV0420200 : 30,
    LV0684901 : 31,
    LV0601000 : 32,
    LV0440200 : 33,
    LV0460200 : 34,
    LV0885100 : 35,
    LV0640801 : 36,
    LV0905100 : 37,
    LV0705500 : 38,
    LV0806000 : 39,
    LV0641000 : 40,
    LV0500200 : 41,
    LV0406400 : 42,
    LV0740600 : 43,
    LV0440801 : 44,
    LV0801800 : 45,
    LV0321000 : 46,
    LV0425700 : 47,
    LV0905700 : 48,
    LV0540200 : 49,
    LV0560200 : 50,
    LV0901201 : 51,
    LV0681000 : 52,
    LV0960200 : 53,
    LV0326100 : 54,
    LV0600202 : 55,
    LV0806900 : 56,
    LV0566900 : 57,
    LV0620200 : 58,
    LV0741001 : 59,
    LV0800800 : 60,
    LV0741401 : 61,
    LV0660200 : 62,
    LV0421200 : 63,
    LV0761201 : 64,
    LV0701400 : 65,
    LV0680200 : 66,
    LV0700200 : 67,
    LV0961000 : 68,
    LV0807400 : 69,
    LV0807600 : 70,
    LV0887600 : 71,
    LV0967300 : 72,
    LV0327100 : 73,
    LV0647900 : 74,
    LV0740202 : 75,
    LV0801000 : 76,
    LV0546701 : 77,
    LV0427500 : 78,
    LV0641401 : 79,
    LV0321400 : 80,
    LV0760202 : 81,
    LV0641600 : 82,
    LV0427300 : 83,
    LV0427700 : 84,
    LV0780200 : 85,
    LV0766300 : 86,
    LV0888301 : 87,
    LV0808400 : 88,
    LV0648500 : 89,
    LV0387500 : 90,
    LV0407700 : 91,
    LV0961600 : 92,
    LV0661400 : 93,
    LV0568700 : 94,
    LV0801200 : 95,
    LV0840200 : 96,
    LV0801400 : 97,
    LV0809200 : 98,
    LV0801601 : 99,
    LV0328200 : 100,
    LV0621200 : 101,
    LV0941600 : 102,
    LV0809600 : 103,
    LV0941800 : 104,
    LV0880200 : 105,
    LV0468900 : 106,
    LV0900200 : 107,
    LV0649300 : 108,
    LV0940200 : 109,
    LV0701800 : 110,
    LV0769101 : 111,
    LV0429300 : 112,
    LV0409500 : 113,
    LV0980200 : 114,
    LV0561800 : 115,
    LV0381600 : 116,
    LV0781800 : 117,
    LV0681801 : 118
}