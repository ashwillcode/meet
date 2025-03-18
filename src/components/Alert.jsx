import { Component } from 'react';

class Alert extends Component {
  constructor(props) {
    super(props);
  }

  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  renderIcon() {
    switch (this.props.className) {
      case 'WarningAlert':
        return (
          <svg 
            className="alert-icon"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5.99L19.53 19H4.47L12 5.99ZM12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
              fill="currentColor"
            />
          </svg>
        );
      case 'InfoAlert':
        return (
          <svg 
            className="alert-icon"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="currentColor"
            />
          </svg>
        );
      case 'ErrorAlert':
        return (
          <svg 
            className="alert-icon"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className={`Alert ${this.props.className || ''}`}>
        <p>
          {this.renderIcon()}
          <span className="alert-text">{this.props.text}</span>
        </p>
        <button 
          onClick={this.handleClose}
          aria-label="Close alert"
        >
          ×
        </button>
      </div>
    );
  }
}

class InfoAlert extends Alert {
  render() {
    return <Alert {...this.props} className="InfoAlert" />;
  }
}

class ErrorAlert extends Alert {
  render() {
    return <Alert {...this.props} className="ErrorAlert" />;
  }
}

class WarningAlert extends Alert {
  render() {
    return <Alert {...this.props} className="WarningAlert" />;
  }
}

export { InfoAlert, ErrorAlert, WarningAlert }; 