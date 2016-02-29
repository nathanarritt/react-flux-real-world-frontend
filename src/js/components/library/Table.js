import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import styleConfig from '../../config/styleConfig';
import Loader from './Loader';
import {formatMessage} from '../../utils/localizationUtils';

// adjustment widths for add-on columns: row numbers, controls and select all

// width of row number and select all columns - in pixels
const defaultAddOnColumnWidth = styleConfig.table.defaultAddOnColumnWidth;

// width for each individual control - in pixels
const defaultControlWidth = styleConfig.table.defaultControlWidth;

// 17 is for padding of 8 on each side plus 1 for border on the left - in pixels
const defaultControlsBorderAndPaddingWidth = styleConfig.table.defaultControlsBorderAndPaddingWidth;

function getAddOnDetails({columns, controls, selectAll, showRowNumber}) {
    let addedColumnsWidth = 0;

    let controlsIndex;

    if (controls) {
        addedColumnsWidth = controls.length * defaultControlWidth + defaultControlsBorderAndPaddingWidth;

        controlsIndex = columns.length;

        if (showRowNumber) {
            controlsIndex++;
        }
    }

    let selectAllIndex;

    if (selectAll) {
        addedColumnsWidth += defaultAddOnColumnWidth;

        selectAllIndex = columns.length;

        if (controls) {
            selectAllIndex++;
        }

        if (showRowNumber) {
            selectAllIndex++;
        }
    }

    if (showRowNumber) {
        addedColumnsWidth += defaultAddOnColumnWidth;
    }

    const columnsLength = columns.length;

    // add .01 to fix IE (tested 10/11, 9 from 11 emulation mode)
    const columnOffset = (addedColumnsWidth / columnsLength) + 0.01;

    return {
        columnOffset,
        controlsIndex,
        selectAllIndex
    };
}

function ControlsHeader({controls}) {
    return (
        <div
            className="table-header controls"
            style={{width: controls.length * defaultControlWidth + defaultControlsBorderAndPaddingWidth}}
        />
    );
}

ControlsHeader.propTypes = {
    controls: PropTypes.arrayOf(PropTypes.object)
};

function RowNumberHeader() {
    return (
        <div
            className="table-header row-number"
            key="0"
            style={{width: defaultAddOnColumnWidth}}
        >
            {'#'}
        </div>
    );
}

function SelectAllHeader() {
    return (
        <div
            className="table-header select-all"
            style={{width: defaultAddOnColumnWidth}}
        >
            <input type="checkbox" />
        </div>
    );
}

function getHeaders({columnOffset, columns, showRowNumber}) {
    return columns.map((column, index) => {
        const key = showRowNumber ? index + 1 : index;

        return (
            <div
                className="table-header"
                key={key}
                style={{width: `calc(${column.width}% - ${columnOffset}px)`}}
            >
                {formatMessage(column.label)}
            </div>
        );
    });
}

getHeaders.propTypes = {
    columnOffset: PropTypes.number,
    columns: PropTypes.arrayOf(PropTypes.object),
    showRowNumber: PropTypes.bool
};

function HeaderRow({columns, controls, scrollbarWidth, selectAll, showRowNumber}) {
    const {columnOffset, controlsIndex, selectAllIndex} = getAddOnDetails({
        columns,
        controls,
        selectAll,
        showRowNumber
    });

    return (
        <div
            className="table-row"
            key="0"
            style={{paddingRight: scrollbarWidth}}
        >
            {showRowNumber &&
                <RowNumberHeader />
            }
            {getHeaders({
                columnOffset,
                columns,
                showRowNumber
            })}
            {controls &&
                <ControlsHeader
                    controls={controls}
                    key={controlsIndex}
                />
            }
            {selectAll &&
                <SelectAllHeader key={selectAllIndex} />
            }
        </div>
    );
}

HeaderRow.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    controls: PropTypes.arrayOf(PropTypes.object),
    scrollbarWidth: PropTypes.number,
    selectAll: PropTypes.bool,
    showRowNumber: PropTypes.bool
};

function handleControlItemAction(item, data) {
    if (typeof item.action === 'function') {
        item.action(data);
    }
}

function getControlItems({controls, data}) {
    const iconMap = {
        edit: 'pencil',
        remove: 'remove'
    };

    return controls.map((item, index) => {
        return (
            <span
                className={`table-data-icon ${item.type}`}
                key={index}
                onClick={handleControlItemAction.bind(null, item, data)}
            >
                <i className={`fa fa-${iconMap[item.type]}`} />
            </span>
        );
    });
}

getControlItems.propTypes = {
    controls: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

function ControlsCell({controls, data, height}) {
    return (
        <div
            className="table-data controls"
            style={{height, width: (controls.length * defaultControlWidth + defaultControlsBorderAndPaddingWidth)}}
        >
            {getControlItems({
                controls,
                data
            })}
        </div>
    );
}

ControlsCell.propTypes = {
    controls: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    height: PropTypes.number
};

function RowNumberCell({rowIndex}) {
    return (
        <div
            className="table-data row-number"
            key="0"
            style={{width: defaultAddOnColumnWidth}}
        >
            {rowIndex + 1}
        </div>
    );
}

RowNumberCell.propTypes = {
    rowIndex: PropTypes.number
};

function SelectAllCell({height}) {
    return (
        <div
            className="table-data select-all"
            style={{height, width: defaultAddOnColumnWidth}}
        >
            <input type="checkbox" />
        </div>
    );
}

SelectAllCell.propTypes = {
    height: PropTypes.number
};

/**
 * @param {function} action Method bound to the view where state is managed
 * @param {object} data Row data
 * @param {any} value Component value
 * @return {undefined} No return value needed
 */
function handleComponentAction(action, data, value) {
    if (typeof action === 'function') {
        action(data, value);
    }
}

function getMultiDataCell(config, data) {
    return config.map((item, index) => {
        const {attribute, formatter, label} = item;

        if (data[attribute] == null || // eslint-disable-line no-eq-null
            (Array.isArray(data[attribute]) && !data[attribute][0])) {

            return null;
        }

        let output;

        if (typeof formatter === 'function') {
            output = formatter(data, attribute);
        } else {
            output = data[attribute];
        }

        return (
            <div
                className="table-multi-data"
                key={index}
            >
                <div className="table-multi-data-label">
                    {formatMessage(label)}
                </div>
                <div className="table-multi-data-value">
                    {output}
                </div>
            </div>
        );
    });
}

function getRowCells({columnOffset, columns, data, height}) {
    return columns.map((column, index) => {
        const {attribute, component, formatter, multiData} = column;

        let output;

        if (Array.isArray(multiData)) {
            output = getMultiDataCell(multiData, data);
        } else if (component) {
            const elementAttributes = typeof component.elementAttributes === 'function'
                ? component.elementAttributes(data)
                : component.elementAttributes;
            output = (
                <component.Element
                    {...elementAttributes}
                    action={handleComponentAction.bind(null, component.action, data)}
                />
            );
        } else if (typeof formatter === 'function') {
            output = formatter(data, attribute);
        } else {
            output = data[attribute];
        }

        return (
            <div
                className="table-data"
                key={index + 1}
                style={{height, width: `calc(${column.width}% - ${columnOffset}px)`}}
            >
                {output}
            </div>
        );
    });
}

getRowCells.propTypes = {
    columnOffset: PropTypes.number,
    columns: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    height: PropTypes.number
};

function getRow({config, data, isEven, rowIndex, rowKey}) {
    const {columns, controls, selectAll, showRowNumber} = config;

    const {columnOffset, controlsIndex, selectAllIndex} = getAddOnDetails({
        columns,
        controls,
        selectAll,
        showRowNumber
    });

    const {isMultiDataColumns, tableRowHeights} = this.state;
    let height = null;

    if (isMultiDataColumns) {
        height = tableRowHeights[rowIndex];
    }

    return (
        <div
            className={`table-row ${isEven ? 'even' : ''}`}
            key={rowKey}
        >
            {showRowNumber &&
                <RowNumberCell rowIndex={rowIndex} />
            }
            {getRowCells({
                columns,
                columnOffset,
                data,
                height
            })}
            {controls &&
                <ControlsCell
                    controls={controls}
                    data={data}
                    height={height}
                    key={controlsIndex}
                />
            }
            {selectAll &&
                <SelectAllCell
                    height={height}
                    key={selectAllIndex}
                />
            }
        </div>
    );
}

function getRows({config, data, isLoading}) {
    if (!data[0] && !isLoading) {
        return (
            <div className="table-row even is-empty">
                <div className="table-data">
                    {formatMessage('NO_ITEMS_AVAILABLE')}
                </div>
            </div>
        );
    }

    return data.map((rowData, rowIndex) => {
        return getRow.call(this, {
            config,
            data: rowData,
            isEven: rowIndex % 2 === 0,
            rowIndex,
            rowKey: rowIndex + 1
        });
    });
}

/*
 * Table class.
 *
 * @class Table
 *
 * The following props are supported:
 *
 * config {object} (required) The config object is used for the table layout and
 *     functionality.
 * data {array} (required) The array of data returned from the API and kept in
 *     the store of the view where state is managed.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * withToolbar {boolean} Used to calculate the table height in setTableHeight().
 *
 * The config object supports the following attributes:
 *
 * columns {array} (required) Array of objects which can have the following
 *     attributes:
 *     - attribute {string} Model attribute
 *     - component {object} Render React Component instead of data value
 *         - action {function} Method bound to the view where state is managed.
 *             The action is passed two attributes, data and value, which is the
 *             table row data and the component value. This is handled by the
 *             handleComponentAction function above.
 *         - Element {Component} Reference to React Component
 *         - elementAttributes {object|function} Attributes to be passed to the
 *             Element. If it's a function, it will receive the data object of
 *             the row currently being rendered as an argument and must return
 *             an object of the Element attributes.
 *     - formatter {function} Create custom output value
 *         - WARNING: be sure to cleanse user entered values to prevent
 *             Cross-Site Scripting (XSS)
 *     - label {string} Text for column header
 *     - multiData {array} Array of objects with the config of each item in the
 *         column. Config objects should have `attribute` and `label` attributes
 *         with optional `formatter` attribute.
 *     - width {integer} Percent of table width
 *
 * controls {array} Array of objects with type and action
 *     - types: edit, remove
 *     - action: a method bound to the parent view where state is managed
 *     NOTE: This option requires Font Awesome
 *           (http://fortawesome.github.io/Font-Awesome/)
 *
 * selectAll {boolean} PENDING DEVELOPMENT, DOES NOT WORK - allows selecting
 *     multiple items for bulk operations
 *
 * showRowNumber {boolean} It, um, ah, displays the row number
 *
 * @example <caption>Example usage:</caption>
 *
 * const tableConfig = {
 *     columns: [
 *         {
 *             attribute: 'name',
 *             formatter(data, attribute) {
 *                 let output = data[attribute];
 *
 *                 if (data.isHubSite) {
 *                     const attributeValue = _.escape(output); // uses lodash to escape HTML tag characters
 *                     const attributeHtml = '<span className="attribute-value">' + attributeValue + '</span>';
 *                     const hubSite = '<span className="hub-site">Hub Site</span>';
 *
 *                     output = (
 *                         <div dangerouslySetInnerHTML={{__html: attributeHtml + hubSite}} />
 *                     );
 *                 }
 *
 *                 return output;
 *             },
 *             label: 'NAME',
 *             width: 50
 *         },
 *         {
 *             attribute: 'provider',
 *             label: 'PROVIDER',
 *             width: 25
 *         },
 *         {
 *             multiData: [
 *                 {
 *                     attribute: 'primarySubcloud',
 *                     formatter(data, attribute) {
 *                         return data[attribute].name;
 *                     },
 *                     label: 'PRIMARY_SUBCLOUD'
 *                 },
 *                 {
 *                     attribute: 'secondarySubcloud',
 *                     formatter(data, attribute) {
 *                         return data[attribute].name;
 *                     },
 *                     label: 'SECONDARY_SUBCLOUD'
 *                 }
 *             ],
 *             label: 'RESOLVE_TO',
 *             width: 35
 *         },
 *         {
 *             component: {
 *                 action: this.handleToggleButtonChange,
 *                 Element: ToggleButton,
 *                 elementAttributes: {
 *                     value: true
 *                 }
 *             },
 *             label: 'SOME_COMPONENT_LABEL',
 *             width: 25
 *         }
 *     ],
 *     controls: [
 *         {
 *             action: this.handleOpen,
 *             type: 'edit'
 *         }
 *     ],
 *     showRowNumber: true
 * };
 *
 */
export default class Table extends Component {

    static propTypes = {
        config: PropTypes.shape({
            columns: PropTypes.arrayOf(PropTypes.object).isRequired,
            controls: PropTypes.arrayOf(PropTypes.object),
            selectAll: PropTypes.bool,
            showRowNumber: PropTypes.bool

        }).isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        isLoading: PropTypes.bool,
        withToolbar: PropTypes.bool
    };

    constructor(props) { // eslint constructor-super error https://github.com/eslint/eslint/issues/5261
        super(props);

        const columns = props.config.columns;
        const columnsLength = columns.length;

        let isMultiDataColumns = false;

        for (let i = 0; i < columnsLength; i++) {
            if (Array.isArray(columns[i].multiData)) {
                isMultiDataColumns = true;
                break;
            }
        }

        this.state = {
            isMultiDataColumns,
            scrollbarWidth: 0,
            tableHeight: 'auto',
            tableRowHeights: []
        };
    }

    componentDidMount() {
        this.setDynamicState();
    }

    componentDidUpdate() {
        this.setDynamicState();
    }

    setDynamicState() {
        const newScrollbarWidth = this.getScrollbarWidth();
        const newTableHeight = this.getTableHeight();
        const newTableRowHeights = this.getTableRowHeights();

        if (newScrollbarWidth || newTableHeight || newTableRowHeights) {
            const newState = {};

            if (newScrollbarWidth) {
                newState.scrollbarWidth = newScrollbarWidth;
            }

            if (newTableHeight) {
                newState.tableHeight = newTableHeight;
            }

            if (newTableRowHeights) {
                newState.tableRowHeights = newTableRowHeights;
            }

            this.setState(newState);
        }
    }

    getScrollbarWidth() {
        const tableBody = this.tableBody;
        const newScrollbarWidth = tableBody.offsetWidth - tableBody.clientWidth;

        if (newScrollbarWidth !== this.state.scrollbarWidth) {
            return newScrollbarWidth;
        }

        return null;
    }

    getTableHeight() {
        const componentNode = ReactDom.findDOMNode(this);
        const componentHeight = componentNode.offsetHeight;
        const parentNodeHeight = componentNode.parentNode.offsetHeight;

        const withToolbar = this.props.withToolbar;

        const toolbarHeight = styleConfig.toolbar.height;

        let newTableHeight;

        if (componentHeight > parentNodeHeight) {
            if (withToolbar) {
                newTableHeight = parentNodeHeight - toolbarHeight;
            } else {
                newTableHeight = parentNodeHeight;
            }
        } else if (componentHeight < parentNodeHeight) {
            if (withToolbar) {
                if (componentHeight + toolbarHeight > parentNodeHeight) {
                    newTableHeight = parentNodeHeight - toolbarHeight;
                } else if (componentHeight + toolbarHeight < parentNodeHeight) {
                    newTableHeight = 'auto';
                }
            } else {
                newTableHeight = 'auto';
            }
        }

        if (newTableHeight && newTableHeight !== this.state.tableHeight) {
            return newTableHeight;
        }

        return null;
    }

    getTableRowHeights() {
        const {isMultiDataColumns, tableRowHeights} = this.state;

        if (isMultiDataColumns) {
            const tableBody = this.tableBody;
            const tableRows = tableBody.childNodes;
            const newTableRowHeights = Array.prototype.map.call(tableRows, tableRow => {
                return tableRow.offsetHeight;
            });

            // if the length of the arrays is different, we know we have new row heights
            let hasNewRowHeight = tableRowHeights.length !== newTableRowHeights.length;

            // if the lengths are the same, compare value at each index
            if (!hasNewRowHeight) {
                for (let i = 0, l = tableRowHeights.length; i < l; i++) {
                    if (tableRowHeights[i] !== newTableRowHeights[i]) {
                        hasNewRowHeight = true;
                        break;
                    }
                }
            }

            if (hasNewRowHeight) {
                return newTableRowHeights;
            }
        }

        return null;
    }

    render() {
        const {isMultiDataColumns, scrollbarWidth, tableHeight} = this.state;

        const {config, data, isLoading} = this.props;

        const {columns, controls, selectAll, showRowNumber} = config;

        return (
            <div
                className={`table-component ${isMultiDataColumns ? 'is-multi-data-columns' : ''}`}
                style={{height: tableHeight}}
            >
                <div className="table-head">
                    <HeaderRow
                        columns={columns}
                        controls={controls}
                        scrollbarWidth={scrollbarWidth}
                        selectAll={selectAll}
                        showRowNumber={showRowNumber}
                    />
                </div>
                <div
                    className="table-body"
                    ref={c => (this.tableBody = c)}
                >
                    {getRows.call(this, {
                        config,
                        data,
                        isLoading
                    })}
                </div>
                {isLoading && <Loader />}
            </div>
        );
    }
}
