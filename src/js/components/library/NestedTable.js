import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import componentsConfig from '../../config/componentsConfig';
import Loader from './Loader';
import Table from './Table';
import {formatMessage} from '../../utils/localizationUtils';

// adjustment widths for add-on columns: row numbers, controls and select all

// width of row number and select all columns - in pixels
const defaultAddOnColumnWidth = componentsConfig.table.defaultAddOnColumnWidth;

// width for each individual control - in pixels
const defaultControlWidth = componentsConfig.table.defaultControlWidth;

// 17 is for padding of 8 on each side plus 1 for border on the left - in pixels
const defaultControlsBorderAndPaddingWidth = componentsConfig.table.defaultControlsBorderAndPaddingWidth;

function getAddOnDetails(addOnConfig) {
    const {columns, controls, selectAll, showRowNumber} = addOnConfig;

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

function getControlsHeader(controlsConfig) {
    const {controls, controlsIndex} = controlsConfig;

    if (controls) {
        return (
            <div
                className="nested-table-header controls"
                key={controlsIndex}
                style={{width: controls.length * defaultControlWidth + defaultControlsBorderAndPaddingWidth}} />
        );
    }

    return null;
}

function getRowNumberHeader(rowNumberConfig) {
    const {showRowNumber} = rowNumberConfig;

    if (showRowNumber) {
        return (
            <div
                className="nested-table-header row-number"
                key="0"
                style={{width: defaultAddOnColumnWidth}}>{'#'}</div>
        );
    }

    return null;
}

function getSelectAllHeader(selectAllConfig) {
    const {selectAll, selectAllIndex} = selectAllConfig;

    if (selectAll) {
        return (
            <div
                className="nested-table-header select-all"
                key={selectAllIndex}
                style={{width: defaultAddOnColumnWidth}}>
                <input type="checkbox" />
            </div>
        );
    }

    return null;
}

function getHeaders(headersConfig) {
    const {columnOffset, columns, showRowNumber} = headersConfig;

    return columns.map((column, index) => {
        const key = showRowNumber ? index + 1 : index;

        return (
            <div
                className="nested-table-header"
                key={key}
                style={{width: `calc(${column.width}% - ${columnOffset}px)`}}>
                {formatMessage(column.label)}
            </div>
        );
    });
}

function getHeaderRow(headerRowConfig) {
    const {
        columns, controls, scrollbarWidth, selectAll, showRowNumber
    } = headerRowConfig;

    const {columnOffset, controlsIndex, selectAllIndex} = getAddOnDetails({
        columns,
        controls,
        selectAll,
        showRowNumber
    });

    return (
        <div
            className="nested-table-row"
            key="0"
            style={{paddingRight: scrollbarWidth}}>
            {getRowNumberHeader({
                showRowNumber
            })}
            {getHeaders({
                columnOffset,
                columns,
                showRowNumber
            })}
            {getControlsHeader({
                controls,
                controlsIndex
            })}
            {getSelectAllHeader({
                selectAll,
                selectAllIndex
            })}
        </div>
    );
}

function handleControlItemAction(item, data) {
    if (typeof item.action === 'function') {
        item.action(data);
    }
}

function getControlItems(controlItemsConfig) {
    const {controls, data} = controlItemsConfig;

    const iconMap = {
        edit: 'pencil',
        remove: 'remove'
    };

    return controls.map((item, index) => {
        return (
            <span
                className={`nested-table-data-icon ${item.type}`}
                key={index}
                onClick={handleControlItemAction.bind(null, item, data)}>
                <i className={`fa fa-${iconMap[item.type]}`} />
            </span>
        );
    });
}

function getControlsCell(controlsCellConfig) {
    const {controls, controlsIndex, data} = controlsCellConfig;

    if (controls) {
        return (
            <div
                className="nested-table-data controls"
                key={controlsIndex}
                style={{width: (controls.length * defaultControlWidth + defaultControlsBorderAndPaddingWidth)}}>
                {getControlItems({
                    controls,
                    data
                })}
            </div>
        );
    }

    return null;
}

function getRowNumberCell(rowNumberCellConfig) {
    const {rowIndex, showRowNumber} = rowNumberCellConfig;

    if (showRowNumber) {
        return (
            <div
                className="nested-table-data row-number"
                key="0"
                style={{width: defaultAddOnColumnWidth}}>
                {rowIndex + 1}
            </div>
        );
    }

    return null;
}

function getSelectAllCell(selectAllCellConfig) {
    const {selectAll, selectAllIndex} = selectAllCellConfig;

    if (selectAll) {
        return (
            <div
                className="nested-table-data select-all"
                key={selectAllIndex}
                style={{width: defaultAddOnColumnWidth}}>
                <input type="checkbox" />
            </div>
        );
    }

    return null;
}

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

function getRowCells(rowCellsConfig) {
    const {columns, columnOffset, data, isExpandedRow} = rowCellsConfig;

    let isFirstColumn = true;

    return columns.map((column, index) => {
        let output = data[column.attribute];

        if (column.component) {
            output = (
                <column.component.Element {...column.component.elementAttributes}
                    action={handleComponentAction.bind(null, column.component.action, data)} />
            );
        } else if (typeof column.formatter === 'function') {
            output = column.formatter(data, column.attribute);
        }

        let icon;

        if (isFirstColumn) {
            isFirstColumn = false;

            icon = (
                <span
                    className="nested-table-data-icon expand"
                    onClick={this.handleExpandedRow.bind(this, data.id)}>
                    <i className={`fa fa-caret-${isExpandedRow ? 'down' : 'right'}`} />
                </span>
            );
        }

        return (
            <div
                className="nested-table-data" key={index + 1}
                style={{width: `calc(${column.width}% - ${columnOffset}px)`}}>
                {icon}
                {output}
            </div>
        );
    });
}

function getRow(rowConfig) {
    const {
        childConfig, childData, config, data, isEven, rowIndex, rowKey
    } = rowConfig;

    const {columns, controls, selectAll, showRowNumber} = config;

    const {columnOffset, controlsIndex, selectAllIndex} = getAddOnDetails({
        columns,
        controls,
        selectAll,
        showRowNumber
    });

    const expandedRow = this.state.expandedRow;
    const isExpandedRow = data.id === expandedRow.id && expandedRow.isExpanded;

    return (
        <div className={`nested-table-row ${isEven ? 'even' : ''}`} key={rowKey}>
            {getRowNumberCell({
                rowIndex,
                showRowNumber
            })}
            {getRowCells.call(this, {
                columns,
                columnOffset,
                data,
                isExpandedRow
            })}
            {getControlsCell({
                controls,
                controlsIndex,
                data
            })}
            {getSelectAllCell({
                selectAll,
                selectAllIndex
            })}
            {isExpandedRow &&
                <div className="nested-table-row-child">
                    <Table
                        config={childConfig}
                        data={childData}
                        isLoading={this.props.isLoading} />
                </div>
            }
        </div>
    );
}

function getRows(rowsConfig) {
    const {childConfig, childData, config, data, isLoading} = rowsConfig;

    if (!data[0] && !isLoading) {
        return (
            <div className="nested-table-row even is-empty">
                <div className="nested-table-data">
                    {formatMessage('NO_ITEMS_AVAILABLE')}
                </div>
            </div>
        );
    }

    return data.map((rowData, rowIndex) => {
        return getRow.call(this, {
            childConfig,
            childData,
            config,
            data: rowData,
            isEven: rowIndex % 2 === 0,
            rowIndex,
            rowKey: rowIndex + 1
        });
    });
}

/*
 * NestedTable class.
 *
 * @class NestedTable
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
 * columns {array} (required) Array of objects
 *     - attribute {string} Model attribute
 *     - component {object} Render React Component instead of data value
 *         - action {function} Method bound to the view where state is managed.
 *             The action is passed two attributes, data and value, which is the
 *             table row data and the component value. This is handled by the
 *             handleComponentAction function above.
 *         - Element {Component} Reference to React Component
 *         - elementAttributes {object} Attributes to be passed to Element
 *     - formatter {function} Create custom output value
 *         - WARNING: be sure to cleanse user entered values to prevent
 *               Cross-Site Scripting (XSS)
 *     - label {string} Text for column header
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
 *                     let attributeValue = _.escape(output); // uses lodash to escape HTML tag characters
 *                     let attributeHtml = '<span className="attribute-value">' + attributeValue + '</span>';
 *                     let hubSite = '<span className="hub-site">Hub Site</span>';
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
 *             component: {
 *                 action: this.handleToggleButtonChange.bind(this),
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
 *             action: this.handleActionOpen.bind(this),
 *             type: 'edit'
 *         }
 *     ],
 *     showRowNumber: true
 * };
 *
 */
export default class NestedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedRow: {
                id: null,
                isExpanded: false
            },
            scrollbarWidth: 0,
            tableHeight: 'auto'
        };
    }

    componentDidMount() {
        this.setTableHeight();
        this.setScrollBarWidth();
    }

    componentDidUpdate() {
        this.setTableHeight();
        this.setScrollBarWidth();
    }

    handleExpandedRow(newId) {
        const {id, isExpanded} = this.state.expandedRow;
        const isNewId = id !== newId;

        if (isNewId) {
            const {data, childDataSource} = this.props;
            const childData = _.find(data, item => {
                return newId === item.id;
            });
            childDataSource(childData);
        }

        this.setState({
            expandedRow: {
                id: newId,
                isExpanded: isNewId || !isExpanded
            }
        });
    }

    setScrollBarWidth() {
        const tableBody = this.refs.tableBody;
        const newScrollbarWidth = tableBody.offsetWidth - tableBody.clientWidth;

        if (newScrollbarWidth !== this.state.scrollbarWidth) {
            this.setState({
                scrollbarWidth: newScrollbarWidth
            });
        }
    }

    setTableHeight() {
        const componentNode = ReactDom.findDOMNode(this);
        const componentHeight = componentNode.offsetHeight;
        const parentNodeHeight = componentNode.parentNode.offsetHeight;

        const withToolbar = this.props.withToolbar;

        const toolbarHeight = componentsConfig.toolbar.height;

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
            this.setState({
                tableHeight: newTableHeight
            });
        }
    }

    render() {
        const {childConfig, childData, config, data, isLoading} = this.props;

        const {columns, controls, selectAll, showRowNumber} = config;

        return (
            <div
                className="nested-table-component"
                style={{height: this.state.tableHeight}}>
                <div className="nested-table-head">
                    {getHeaderRow({
                        columns,
                        controls,
                        scrollbarWidth: this.state.scrollbarWidth,
                        selectAll,
                        showRowNumber
                    })}
                </div>
                <div className="nested-table-body" ref="tableBody">
                    {getRows.call(this, {
                        childConfig,
                        childData,
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

NestedTable.propTypes = {
    childConfig: PropTypes.object.isRequired,
    childData: PropTypes.array.isRequired,
    childDataSource: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    withToolbar: PropTypes.bool
};
