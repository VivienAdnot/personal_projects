import React, { PureComponent } from 'react';
import '../../style/Square.css';
import { HIDDEN, VISIBLE, MARKED } from '../../services/logic/constants';

class Square extends PureComponent {

    getValue = () => {
        switch (this.props.visibility) {
            case HIDDEN:
                if (this.props.godMode) return this.props.value;
                return 'hidden';
            case VISIBLE:
                return this.props.value;
            case MARKED:
                return 'M';
            default: throw new Error(`unknown state ${this.state.squareStatus}`);
        }
    }

    getClassName = () => {
        switch (this.props.visibility) {
            case HIDDEN:
                return 'square-hidden';
            case VISIBLE:
                return 'square-visible';
            case MARKED:
                return 'square-marked';
            default: throw new Error(`unknown state ${this.state.squareStatus}`);
        }
    }

    render() {

        let value = this.getValue();

        let fullClassName = `square ${this.getClassName()} square-value-${value}`;

        if (this.props.godMode) {
            fullClassName += ' debug';
        }

        if (this.props.isPositionLost) {
            fullClassName += ' bomb-lost';
        }

        return (
            <button
                className={fullClassName}

                onClick={() => {
                    if (this.props.clickable) this.props.onLeftClick(this.props.position, this.props.value, this.props.visibility)
                }}

                onContextMenu={(ev) => {
                    ev.preventDefault();
                    if (this.props.clickable) this.props.onRightClick(this.props.position);
                }}

                onDoubleClick={() => {
                    if (this.props.clickable) this.props.onDblClick(this.props.position)
                }}
            >
                {value}
            </button>
        );

    }
}

export default Square;