import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import Checkbox from './Checkbox';
import Loader from '../Loader';
import {formatMessage} from '../../../utils/localizationUtils';
import Search from '../Search';

function createIdToGroupByMap(groupBy, list) {
    const map = {};

    _.each(list, item => {
        map[item.id] = item[groupBy];
    });

    return map;
}

function getSearchValue(groupBy, list, searchValue) {
    const searchValueRegEx = new RegExp(searchValue, 'i');

    return list.filter(item => {
        const isNameMatch = searchValueRegEx.test(item.name);
        const isGroupByMatch = groupBy
            ? searchValueRegEx.test(item[groupBy].name)
            : false;
        return isNameMatch || isGroupByMatch;
    });
}

function getSelectedList(value, searchValue, groupBy, idToGroupByMap) {
    let selectedList = [...value];

    if (groupBy && idToGroupByMap) {
        selectedList = selectedList.map(item => {
            const newItem = {
                id: item.id,
                name: item.name
            };

            newItem[groupBy] = idToGroupByMap[item.id];

            return newItem;
        });
    }

    if (searchValue) {
        selectedList = getSearchValue(groupBy, selectedList, searchValue);
    }

    return selectedList;
}

function getUnselectedListItems(list, value) {
    if (value && value[0]) {
        const valueIds = value.map(item => {
            return item.id;
        });

        return list.filter(item => {
            return valueIds.indexOf(item.id) === -1;
        });
    }

    return list;
}

function getUnselectedListLength(list, value) {
    return getUnselectedListItems(list, value).length;
}

function getUnselectedList(list, value, searchValue, groupBy) {
    let unselectedList = getUnselectedListItems([...list], value);

    if (searchValue) {
        unselectedList = getSearchValue(groupBy, unselectedList, searchValue);
    }

    return unselectedList;
}

function sortValue(value) {
    return _.sortBy(value, item => {
        return item.name.toLowerCase();
    });
}

function groupDisplayList(groupBy, list) {
    let displayList = [];

    const groups = {};

    _.each(list, item => {
        const groupByAttributeValue = item[groupBy];

        if (groupByAttributeValue && !groups[groupByAttributeValue.id]) {
            groups[groupByAttributeValue.id] = {
                id: groupByAttributeValue.id,
                name: groupByAttributeValue.name,
                children: []
            };
        } else if (!groupByAttributeValue && !groups.uncategorized) {
            groups.uncategorized = {
                id: 'uncategorized',
                name: formatMessage('UNCATEGORIZED_TEXT'),
                children: []
            };
        }

        if (groupByAttributeValue) {
            groups[groupByAttributeValue.id].children.push(item);
        } else {
            groups.uncategorized.children.push(item);
        }
    });

    _.forOwn(groups, item => {
        displayList.push(item);
    });

    displayList = sortValue(displayList);

    return displayList;
}

function getDisplayList(data) {
    const {
        groupBy, idToGroupByMap, list, selectedSearchValue,
        unselectedSearchValue, value
    } = data;

    let unselectedList = [];
    let selectedList = [];

    if (list && value) {
        unselectedList = getUnselectedList(list, value, unselectedSearchValue, groupBy);
    } else if (value) {
        selectedList = getSelectedList(value, selectedSearchValue, groupBy, idToGroupByMap);
    }

    if (groupBy) {
        if (list) {
            unselectedList = groupDisplayList(groupBy, unselectedList);
        } else {
            selectedList = groupDisplayList(groupBy, selectedList);
        }
    }

    if (list) {
        return unselectedList;
    }

    return selectedList;
}

class CategoryCheckbox extends Component {

    static propTypes = {
        data: PropTypes.shape({
            children: PropTypes.arrayOf(PropTypes.objects)
        }).isRequired,
        isChecked: PropTypes.bool.isRequired,
        onAction: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.handleAction = this.handleAction.bind(this);
    }

    handleAction() {
        const {data, onAction} = this.props;
        onAction(data.children);
    }

    render() {
        const {data, isChecked} = this.props;

        return (
            <Checkbox
                isChecked={isChecked}
                label={data.name}
                onAction={this.handleAction}
                withPadding
            />
        );
    }
}

class ItemCheckbox extends Component {

    static propTypes = {
        data: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        }).isRequired,
        isChecked: PropTypes.bool.isRequired,
        onAction: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.handleAction = this.handleAction.bind(this);
    }

    handleAction() {
        const {data, onAction} = this.props;
        onAction(data.id, data.name);
    }

    render() {
        const {data, isChecked} = this.props;

        return (
            <Checkbox
                isChecked={isChecked}
                label={data.name}
                onAction={this.handleAction}
                withPadding
            />
        );
    }
}

/**
 *
 * Builds the list item JSX structure
 *
 * @param {string} groupBy Used to determine which structure to use.
 * @param {array} list Items to iterate.
 * @param {string} type `selected` sets isChecked to true. Otherwise it's false.
 * @return {element} JSX DOM structure.
 *
 */
function getListItems(groupBy, list, type) {
    const isSelected = type === 'selected';
    const categoryAction = isSelected
        ? this.handleRemoveCategory.bind(this)
        : this.handleAddCategory.bind(this);
    const itemAction = isSelected
        ? this.handleRemoveItem.bind(this)
        : this.handleAddItem.bind(this);

    return list.map((item, index) => {
        if (groupBy) {
            return (
                <li
                    className="multi-select-list-item category"
                    key={index}
                    title={item.name}
                >
                    <CategoryCheckbox
                        data={item}
                        isChecked={isSelected}
                        onAction={categoryAction}
                    />
                    <ul className="multi-select-list-item-children">
                        {item.children.map((child, childIndex) => {
                            return (
                                <li
                                    className="multi-select-list-item child"
                                    key={childIndex}
                                    title={child.name}
                                >
                                    <ItemCheckbox
                                        data={child}
                                        isChecked={isSelected}
                                        onAction={itemAction}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </li>
            );
        }

        return (
            <li
                className="multi-select-list-item"
                key={index}
                title={item.name}
            >
                <ItemCheckbox
                    data={item}
                    isChecked={isSelected}
                    onAction={itemAction}
                />
            </li>
        );
    });
}

function getUnselectedListOutput() {
    const {hasFetched, isFetching, list, unselectedList} = this.state;
    const groupBy = this.props.groupBy;

    let listItems;

    if (isFetching && !list[0]) {
        // eslint-disable-next-line no-extra-parens
        listItems = (
            <li className="multi-select-list-item-loader">
                <Loader />
            </li>
        );
    } else if (hasFetched && !list[0]) {
        // eslint-disable-next-line no-extra-parens
        listItems = (
            <li className="multi-select-list-item-empty">
                {formatMessage('NO_ITEMS_AVAILABLE')}
            </li>
        );
    } else {
        listItems = getListItems.call(this, groupBy, unselectedList, 'unselected');
    }

    return (
        <ul className={`multi-select-list-unselected-options ${groupBy ? 'group-by' : ''}`}>
            {listItems}
        </ul>
    );

}

function getSelectedListOutput() {
    const selectedList = this.state.selectedList;
    const groupBy = this.props.groupBy;

    let listItems;

    if (selectedList && selectedList[0]) {
        listItems = getListItems.call(this, groupBy, selectedList, 'selected');
    }

    return (
        <ul className={`multi-select-list-selected-options ${groupBy ? 'group-by' : ''}`}>
            {listItems}
        </ul>
    );
}

/*
 * MultiSelect class.
 *
 * @class MultiSelect
 *
 * The following props are supported:
 *
 * action {function} (required) A method bound to the view where state is
 *    managed that processes the selected value
 * allowSelectAll {boolean} Enable Select All functionality
 * attribute {string} (required) Model attribute
 * expandDirection {string} (left | right) Sets the direction of the expanded
 *     drop down relative to the `multi-select-value` field. Defaults to right.
 * groupBy {string} Attribute within the data to use as a category grouping. The
 *     attribute value is expected to be an entity reference with `id` and `name`
 *     properties. The `name` value is used as the heading text and is assumed
 *     to have already been localized.
 * list {array} (required) The available options to select as the value
 * listSource {function} A method bound to the view where state is managed that
 *     fetches the list items
 * value {array} Array of objects with an id and name attribute:
 *     [{id: SOME_ID, name: 'Some Name'}]
 *
 * @example <caption>Example usage:</caption>
 *
 *     <MultiSelect
 *         action={action || defaultAction}
 *         allowSelectAll={true}
 *         attribute={attribute}
 *         expandDirection={columnType === 'right' ? 'left' : 'right'}
 *         groupBy={groupBy}
 *         list={list}
 *         listSource={listSource}
 *         value={data[attribute]} />
 *
 */
export default class MultiSelect extends Component {

    static propTypes = {
        action: PropTypes.func.isRequired,
        allowSelectAll: PropTypes.bool,
        attribute: PropTypes.string.isRequired,
        error: PropTypes.string,
        expandDirection: PropTypes.string,
        groupBy: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.string
        })).isRequired,
        listSource: PropTypes.func,
        placeholder: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.string
        }))
    };

    constructor(props) {
        super(props);

        const groupBy = props.groupBy;
        const list = props.list;
        const value = props.value || [];

        const idToGroupByMap = groupBy ? createIdToGroupByMap(groupBy, list) : null;

        this.state = {
            idToGroupByMap,
            hasFetched: false,
            isExpanded: false,
            isFetching: false,
            list,
            selectedList: getDisplayList({groupBy, idToGroupByMap, value}),
            selectedSearchValue: '',
            unselectedList: getDisplayList({groupBy, list, value}),
            unselectedListLength: getUnselectedListLength(list, value),
            unselectedSearchValue: '',
            value
        };

        this.handleClearSelection = this.handleClearSelection.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleSaveValue = this.handleSaveValue.bind(this);
        this.handleSearchSelected = this.handleSearchSelected.bind(this);
        this.handleSearchUnselected = this.handleSearchUnselected.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleToggleExpanded = this.handleToggleExpanded.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillReceiveProps(nextProps) {
        const {groupBy, list, value} = nextProps;
        const {selectedSearchValue, unselectedSearchValue} = this.state;

        if (list) {
            let idToGroupByMap;

            if (groupBy) {
                idToGroupByMap = createIdToGroupByMap(groupBy, list);
            }

            const newState = {
                idToGroupByMap,
                list,
                selectedList: getDisplayList({
                    groupBy, idToGroupByMap, selectedSearchValue, value
                }),
                unselectedList: getDisplayList({
                    groupBy, list, unselectedSearchValue, value
                }),
                unselectedListLength: getUnselectedListLength(list, value),
                value
            };

            if (this.state.isFetching) {
                newState.hasFetched = true;
                newState.isFetching = false;
            }

            this.setState(newState);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleAddCategory(children) {
        const value = this.state.value;

        children.forEach(child => {
            value.push({
                id: child.id,
                name: child.name
            });
        });

        this.updateListValues({
            value: sortValue(value)
        });
    }

    handleAddItem(id, name) {
        const value = this.state.value;

        value.push({
            id,
            name
        });

        this.updateListValues({
            value: sortValue(value)
        });
    }

    handleClearSelection() {
        this.updateListValues({
            value: []
        });
    }

    handleDocumentClick(event) {
        if (!ReactDom.findDOMNode(this).contains(event.target) &&
            !/^(checkbox-|fa fa-check)/.test(event.target.className)) {

            if (this.state.isExpanded) {
                this.handleSaveValue();
            }
        }
    }

    handleRemoveCategory(children) {
        this.updateListValues({
            value: _.reject(this.state.value, item => {
                return !!_.find(children, child => {
                    return item.id === child.id;
                });
            })
        });
    }

    handleRemoveItem(id) {
        this.updateListValues({
            value: _.reject(this.state.value, item => {
                return item.id === id;
            })
        });
    }

    handleSaveValue() {
        const {action, attribute} = this.props;

        action({
            attribute,
            value: this.state.value
        });

        this.setState({
            isExpanded: false
        });
    }

    handleSearchSelected(value) {
        this.updateListValues({
            selectedSearchValue: value
        });
    }

    handleSearchUnselected(value) {
        this.updateListValues({
            unselectedSearchValue: value
        });
    }

    handleSelectAll() {
        this.updateListValues({
            value: _.map(this.state.list, item => {
                return {
                    id: item.id,
                    name: item.name
                };
            })
        });
    }

    handleToggleExpanded() {
        const {hasFetched, isExpanded, list, value} = this.state;
        const listSource = this.props.listSource;

        if (!hasFetched && !list[0] && listSource) {
            this.setState({
                isFetching: true
            });

            listSource();
        }

        if (isExpanded && value && value[0]) {
            this.handleSaveValue();
        } else {
            this.setState({
                isExpanded: !isExpanded
            });
        }
    }

    updateListValues(options) {
        let {value, selectedSearchValue, unselectedSearchValue} = options;

        const {idToGroupByMap, list} = this.state;

        const groupBy = this.props.groupBy;

        if (!value) {
            value = this.state.value;
        }

        if (typeof selectedSearchValue === 'undefined') {
            selectedSearchValue = this.state.selectedSearchValue;
        }

        if (typeof unselectedSearchValue === 'undefined') {
            unselectedSearchValue = this.state.unselectedSearchValue;
        }

        this.setState({
            selectedList: getDisplayList({
                groupBy, idToGroupByMap, selectedSearchValue, value
            }),
            selectedSearchValue,
            unselectedList: getDisplayList({
                groupBy, list, unselectedSearchValue, value
            }),
            unselectedListLength: getUnselectedListLength(list, value),
            unselectedSearchValue,
            value
        });
    }

    render() {
        const {isExpanded, unselectedListLength, value} = this.state;

        const getListValue = () => {
            return value.map(item => {
                return item.name;
            }).join(', ');
        };

        const {
            allowSelectAll,
            error,
            expandDirection = 'right',
            placeholder = 'PLEASE_SELECT'
        } = this.props;

        const isDefaultExpandDirection = expandDirection === 'right';
        const hasValue = value && value[0];

        return (
            <div className={`multi-select-component ${isExpanded ? 'is-expanded' : ''} ${error ? 'has-error' : ''}`}>
                <div
                    className="multi-select-value"
                    onClick={this.handleToggleExpanded}
                >
                    <span className={!hasValue ? 'no-value' : null}>
                        {hasValue ? getListValue() : formatMessage(placeholder)}
                    </span>
                    <i className={`fa fa-caret-${isExpanded ? 'up' : 'down'} multi-select-value-icon`} />
                </div>
                {error &&
                    <div className="form-column-item-error-icon">
                        <i className="fa fa-times-circle" />
                    </div>
                }
                {error &&
                    <div className="form-column-item-error-message">
                        {error}
                    </div>
                }
                {isExpanded &&
                    <div className={`multi-select-list ${expandDirection}`}>
                        <div className="multi-select-list-options">
                            <div className="multi-select-list-unselected">
                                <div className={`multi-select-list-header ${!isDefaultExpandDirection ? 'left-radius' : ''}`}>
                                    {formatMessage('UNSELECTED_ITEMS', [unselectedListLength ? unselectedListLength : 0])}
                                </div>
                                <div className="multi-select-list-search left">
                                    <Search
                                        allowKeyUp
                                        onAction={this.handleSearchUnselected}
                                        placeholder="SEARCH_UNSELECTED_ITEMS_BY"
                                    />
                                </div>
                                {getUnselectedListOutput.call(this)}
                            </div>
                            <div className="multi-select-list-selected">
                                <div className={`multi-select-list-header right ${isDefaultExpandDirection ? 'right-radius' : ''}`}>
                                    {formatMessage('SELECTED_ITEMS', [value ? value.length : 0])}
                                </div>
                                <div className="multi-select-list-search right">
                                    <Search
                                        allowKeyUp
                                        onAction={this.handleSearchSelected}
                                        placeholder="SEARCH_SELECTED_ITEMS_BY"
                                    />
                                </div>
                                {getSelectedListOutput.call(this)}
                            </div>
                        </div>
                        <div className="multi-select-list-footer">
                            <span
                                className="button primary small"
                                onClick={this.handleSaveValue}
                            >
                                {formatMessage('DONE')}
                            </span>
                            {allowSelectAll &&
                                <span
                                    className="button small"
                                    onClick={this.handleSelectAll}
                                >
                                    {formatMessage('SELECT_ALL')}
                                </span>
                            }
                            <span
                                className="button small"
                                onClick={this.handleClearSelection}
                            >
                                {formatMessage('CLEAR_SELECTION')}
                            </span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
