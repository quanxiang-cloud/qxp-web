import React, { useState, useEffect } from 'react'

interface IDropdown {
    content: JSX.Element
    children?: JSX.Element
}

export const Dropdown = ({ ...props }: IDropdown) => {
    const [showMenu, setShowMenu] = useState(false)
    const remove = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation()
        setShowMenu(false)
        document.removeEventListener('click', remove, false)
    }

    const show = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
        document.addEventListener('click', remove, false)
    }

    useEffect(() => {
        return () => {
            document.removeEventListener('click', remove, false)
        };
    }, []);

    return (
        <div onClick={show}>
            {props.children}
            {showMenu ? props.content : null}
        </div>
    )
}
export default Dropdown