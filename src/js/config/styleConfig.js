// This file contains style related data required for rendering components.
// Numbers are in pixels unless otherwise noted.

export default {

    dropDown: {
        listItemWidth: 280
    },

    form: {
        sectionLastChildBottomMargin: 12
    },

    listBuilder: {

        // 4 is for margin-right, 1 is for browsers using float pixel sizes on button width
        inputMarginRight: 5
    },

    modal: {

        // used to determine if scrollbar is needed
        bodyPaddingTopAndBottom: 32,
        componentPaddingTopAndBottom: 32,

        transitionAppear: true,
        transitionAppearTimeout: 400, // ms
        transitionEnterTimeout: 400, // ms
        transitionLeaveTimeout: 300 // ms
    },

    table: {

        // width of row number and select all columns
        defaultAddOnColumnWidth: 45,

        // 17 is for padding of 8 on each side plus 1 for border on the left
        defaultControlsBorderAndPaddingWidth: 17,

        // width for each individual control
        defaultControlWidth: 28
    },

    toolbar: {
        height: 37
    }

};
