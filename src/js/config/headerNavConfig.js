export default [
    {
        label: 'RFRWF_DASHBOARD',
        className: 'float',
        icon: 'fa fa-dashboard',
        pathname: '/dashboard'
    },
    {
        label: 'RFRWF_WIDGETS',
        className: 'float',
        icon: 'fa fa-gears',
        pathname: '/widgets'
    },
    {
        label: 'RFRWF_ANOTHER_SECTION',
        className: 'float',
        icon: 'fa fa-paw',
        pathname: '/another-section'
    },
    {
        className: 'inline thing-selector',
        component: 'ContextSelector'
    },
    {
        label: 'RFRWF_SEARCH',
        className: 'inline',
        icon: 'fa fa-search',
        pathname: '/search'
    },
    {
        label: 'RFRWF_ACTIVATIONS',
        className: 'inline',
        icon: [
            'fa fa-database activations-database-icon',
            'fa fa-check activations-check-icon'
        ],
        pathname: '/activations'
    },
    {
        label: 'RFRWF_MY_PROFILE',
        className: 'inline',
        icon: 'fa fa-user',
        pathname: '/my-profile'
    },
    {
        label: 'RFRWF_HELP',
        className: 'inline',
        icon: 'fa fa-question-circle',
        pathname: '/help'
    },
    {
        label: 'RFRWF_SIGN_OUT',
        className: 'inline with-text',
        icon: 'fa fa-sign-out',
        pathname: '/login'
    }
];
