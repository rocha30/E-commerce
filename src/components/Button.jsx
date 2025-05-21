import React from "react";
import styles from "../styles/components/Button.module.css";

export default function Button({ variant = 'primary', Onclick, disable = false, children }) {
    const className = [styles.button, styles[variant]].join('');
    return (
        <button className={className} onClick={Onclick} disabled={disable}>
            {children}
        </button>

    )
}