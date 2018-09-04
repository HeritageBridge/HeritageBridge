"use strict";

import React from "react";

export default class TextField extends React.Component {
    static defaultProps = {
        autoCapitalize: false,
        autoCorrect: false,
        disabled: false,
        iconSrc: '',
        label: '',
        shadow: true,
        onBlur: () => {},
        onEnter: () => {},
        onChange: () => {},
        onClear: () => {},
        onFocus: () => {},
        placeholder: "",
        showClearButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            value: props.value || ""
        };
    }

    handleOnBlur = event => {
        this.setState({ focus: false });
        this.props.onBlur(event);
    };

    handleOnFocus = event => {
        this.setState({ focus: true });
        this.props.onFocus(event);
    };

    handleOnClear = event => {
        setTimeout(() => {
            this.setState({ value: "" });
            this.input.focus();
            this.props.onClear(event);
        }, 100);
    };

    handleOnChange = event => {
        this.setState({ value: event.target.value });
        this.props.onChange(event);
    };

    handleOnKeypress = event => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.input.blur();
            this.props.onEnter();
        }
    };

    setValue = value => {
        this.setState({ value });
        this.input.value = value;
    };

    render() {
        const { focus, value } = this.state;

        const {
            autoCapitalize,
            autoCorrect,
            disabled,
            iconSrc,
            label,
            placeholder,
            shadow,
            showClearButton,
            style,
        } = this.props;

        const labelClassName = ["amal-text-field-label"]
            .concat(label.length > 0 ? ["visible"] : [""])
            .join(" ");

        const wrapperClassName = ["amal-text-field"]
            .concat(disabled ? ["disabled"] : [""])
            .join(" ");

        const inputContainerClassName = ["amal-text-field-input-container"]
            .concat(focus ? ["focus"] : [""])
            .concat(shadow ? ["shadow"] : [""])
            .join(" ");

        const inputClassName = ["amal-text-field-input"]
            .join(" ");

        const clearButtonContainerClassName = [
            "amal-text-field-button-container clear"
        ]
            .concat(value.length && showClearButton ? ["visible"] : [""])
            .join(" ");

        const iconContainerClassName = [
            'amal-text-field-button-container icon'
        ]
            .concat(iconSrc.length > 0 ? 'visible' : '')
            .join(' ');

        return (
            <div className={wrapperClassName} style={style}>
                <label className={labelClassName}>{label}</label>
                <div className={inputContainerClassName}>
                    <div className={iconContainerClassName}>
                        <img src={iconSrc}/>
                    </div>
                    <input
                        autoCapitalize={autoCapitalize ? "sentences" : "none"}
                        autoCorrect={autoCorrect ? "on" : "off"}
                        className={inputClassName}
                        onBlur={this.handleOnBlur}
                        onChange={this.handleOnChange}
                        onFocus={this.handleOnFocus}
                        onKeyPress={this.handleOnKeypress}
                        placeholder={placeholder}
                        ref={input => {
                            this.input = input;
                        }}
                        value={value}
                    />
                    <div
                        className={clearButtonContainerClassName}
                        onClick={this.handleOnClear}
                    >
                        <div>
                            <svg
                                width="14px"
                                height="14px"
                                viewBox="0 0 14 14"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g stroke="none" fill="none">
                                    <g
                                        transform="translate(-759.000000, -3329.000000)"
                                        id="ui-16px-1_simple-remove"
                                        fill="rgba(46, 62, 88, 0.25)"
                                    >
                                        <g transform="translate(759.000000, 3329.000000)">
                                            <path d="M13.7,0.3 C13.3,-0.1 12.7,-0.1 12.3,0.3 L7,5.6 L1.7,0.3 C1.3,-0.1 0.7,-0.1 0.3,0.3 C-0.1,0.7 -0.1,1.3 0.3,1.7 L5.6,7 L0.3,12.3 C-0.1,12.7 -0.1,13.3 0.3,13.7 C0.5,13.9 0.7,14 1,14 C1.3,14 1.5,13.9 1.7,13.7 L7,8.4 L12.3,13.7 C12.5,13.9 12.8,14 13,14 C13.2,14 13.5,13.9 13.7,13.7 C14.1,13.3 14.1,12.7 13.7,12.3 L8.4,7 L13.7,1.7 C14.1,1.3 14.1,0.7 13.7,0.3 Z" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .amal-text-field {
                        min-width: 200px;
                        transition: all 333ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                    }

                    .amal-text-field.disabled {
                        opacity: 0.7;
                        pointer-events: none;
                    }

                    .amal-text-field,
                    .amal-text-field-input {
                        width: 100%;
                    }

                    .amal-text-field-label {
                        font-size: 16px;
                        font-weight: 500;
                        display: none;
                        letter-spacing: 0.5px;
                        line-height: 19px;
                        text-transform: uppercase;
                    }

                    .amal-text-field-label.visible {
                        display: block;
                        padding-bottom: 4px;
                    }

                    .amal-text-field-input-container {
                        background-color: transparent;
                        border: 1px solid rgba(46, 62, 88, 0.25);
                        display: table;
                        overflow: hidden;
                        width: 100%;
                        box-sizing: border-box;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        transition: all 333ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                    }

                    .amal-text-field-input-container.shadow {
                        box-shadow: 0 4px 7px 0 rgba(164, 170, 180, 0.15);
                    }

                    .amal-text-field-input {
                        border: none;
                        box-sizing: border-box;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        display: table-cell;
                        color: #30343f;
                        font-family: "Raleway";
                        font-size: 14px;
                        font-weight: 400;
                        height: 48px;
                        letter-spacing: 0.5px;
                        line-height: 16px;
                        outline: none;
                        padding-left: 16px;
                        z-index: -1;
                    }

                    .amal-text-field-input-container.focus {
                        box-shadow: 0 4px 7px 0 rgba(164, 170, 180, 0.35);
                    }

                    .amal-text-field-input::-webkit-input-placeholder {
                        color: #9B9B9B;
                        font-weight: 400;
                        letter-spacing: 0.75px;
                        opacity: 0.5;
                    }
                    .amal-text-field-input::-moz-placeholder {
                        color: #9B9B9B;
                        font-weight: 400;
                        letter-spacing: 0.75px;
                        opacity: 0.5;
                    }
                    .amal-text-field-input:-ms-input-placeholder {
                        color: #9B9B9B;
                        font-weight: 400;
                        letter-spacing: 0.75px;
                        opacity: 0.5;
                    }

                    .amal-text-field-button-container {
                        background-color: #fff;
                        cursor: pointer;
                        display: none;
                        width: 0;
                        height: 0;
                        opacity: 0;
                        position: relative;
                        text-align: center;
                        transition: opacity 333ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                        user-select: none;
                    }

                    .amal-text-field-button-container.icon {
                        padding-left: 16px;
                        width: 20px;
                        cursor: auto;
                    }

                    .amal-text-field-button-container.clear.visible {
                        width: 38px;
                    }

                    .amal-text-field-button-container.visible {
                        opacity: 1;
                        display: table-cell;
                        vertical-align: middle;
                    }
                `}</style>
            </div>
        );
    }
}
