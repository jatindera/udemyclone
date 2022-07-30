import React from 'react'
import TopNav from '../components/TopNav'


const Layout = (props) => {
    return (
        <>
            <TopNav></TopNav>
            {props.children}
        </>
    )
}

export default Layout