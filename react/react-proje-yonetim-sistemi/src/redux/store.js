import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import userSlice from './slices/userSlice'
import connectionSlice from './slices/connectionSlice'
import connectionRequestSlice from './slices/connectionRequestSlice'
import projectSlice from './slices/projectSlice'
import projectMemberSlice from './slices/projectMemberSlice'
import taskSlice from './slices/taskSlice'
import projectStatisticsSlice from './slices/projectStatisticsSlice'



const rootReducer = combineReducers({
    user: userSlice,
    connection: connectionSlice,
    connectionRequest: connectionRequestSlice,
    project: projectSlice,
    projectMember: projectMemberSlice,
    task: taskSlice,
    projectStatistics: projectStatisticsSlice
})


const persistConfig = {
    key: "root",
    storage,
    version: 1,
    blacklist: ['connection', 'connectionRequest', 'projectMember', 'task', "project"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare({
        serializableCheck: false
    })
})

export const persistor = persistStore(store)