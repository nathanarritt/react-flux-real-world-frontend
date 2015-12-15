import React, {Component} from 'react';

import Modal from '../library/Modal';
import Table from '../library/Table';

import basicTableActions from '../../actions/basicTableActions';
import basicTableStore from '../../stores/basicTableStore';

export default class BasicTable extends Component {
    constructor(props) {
        super(props);
        this.state = basicTableStore.getState().toJS();
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentWillMount() {
        basicTableStore.addChangeListener(this.handleStateChange);
    }

    componentDidMount() {
        basicTableActions.fetch();
    }

    componentWillUnmount() {
        basicTableStore.removeChangeListener(this.handleStateChange);
    }

    handleResetActionError() {
        basicTableActions.resetActionError();
    }

    handleStateChange() {
        this.setState(basicTableStore.getState().toJS());
    }

    render() {
        const tableConfig = {
            columns: [
                {
                    attribute: 'name',
                    label: 'RFRWF_NAME',
                    width: 30
                },
                {
                    attribute: 'description',
                    label: 'RFRWF_DESCRIPTION',
                    width: 70
                }
            ],
            showRowNumber: true
        };

        const {basicTables, hasError, isLoading} = this.state;
        const errorResponse = this.state.errorResponse || {};

        return (
            <div className="page-content with-scroll">
                <Table
                    config={tableConfig}
                    data={basicTables}
                    isLoading={isLoading} />
                {hasError &&
                    <Modal
                        handleAlert={this.handleResetActionError}
                        title={errorResponse.code}>

                        <p>{errorResponse.message}</p>
                    </Modal>
                }
            </div>
        );
    }
}
