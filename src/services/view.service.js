import { View } from '../models/view.model.js';

export const findView = async (data) => {
    try {
        const view = await View.find(data);
        return view;
    } catch (error) {
        console.error('Error white fetching view by data ', data, ' :', error);
        return null;
    }
};


export const updateViewData = async (viewer, video, watchDuration) => {
    try {
        const viewData = await findView({
            viewer,
            video,
        });
        const view = await View.findByIdAndUpdate(
            viewData._id,
            {
                video,
                viewer,
                watchDuration,
            },
            {
                upsert: true,
                new: true,
            },
        );
        return view;
    } catch (error) {
        console.error(
            'Error white updating view by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};
