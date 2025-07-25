export const importConfigs = [
    {
        model: 'hotel',
        directory: 'hotel_json_cleaned',
        extraFields: ['price'],
    },
    {
        model: 'restaurant',
        directory: 'restaurant_json',
        extraFields: ['category'],
    },
    {
        model: 'thingsToDo',
        directory: 'things_to_do_json',
        extraFields: ['category', 'location'],
    },
];
