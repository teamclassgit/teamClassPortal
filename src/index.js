// ** React Imports
import {Suspense, lazy} from 'react'
import ReactDOM from 'react-dom'

// ** Redux Imports
import {Provider} from 'react-redux'
import {store} from './redux/storeConfig/store'

// ** Toast & ThemeColors Context
import {ToastContainer} from 'react-toastify'
import {ThemeContext} from './utility/context/ThemeColors'

// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner'

// ** Ripple Button
import './@core/components/ripple-button'

// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** React Toastify
import '@styles/react/libs/toastify/toastify.scss'

// ** Core styles
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'

// ** Service Worker
import * as serviceWorker from './serviceWorker'

// ** Fake Database
import './@fake-db'

//import aws amplify, graphql
import {createAuthLink} from 'aws-appsync-auth-link'
import {createHttpLink} from 'apollo-link-http'
import Amplify from 'aws-amplify'
import AppSyncConfig from './aws-exports'
import {ApolloClient, ApolloLink, ApolloProvider, InMemoryCache} from '@apollo/client'

const url = AppSyncConfig.aws_appsync_graphqlEndpoint

const region = AppSyncConfig.aws_appsync_region

const auth = {
    type: AppSyncConfig.aws_appsync_authenticationType,
    apiKey: AppSyncConfig.aws_appsync_apiKey
}

const link = ApolloLink.from([
    createAuthLink({url, region, auth}),
    createHttpLink({uri: url})
])

const client = new ApolloClient({
    link,
    disableOffline: true,
    cache: new InMemoryCache()
})

Amplify.configure(AppSyncConfig)

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))


ReactDOM.render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <Suspense fallback={<Spinner/>}>
                <ThemeContext>
                    <LazyApp/>
                    <ToastContainer newestOnTop/>
                </ThemeContext>
            </Suspense>
        </Provider>
    </ApolloProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
