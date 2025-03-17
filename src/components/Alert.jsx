import { Component } from 'react';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.color = null;
  }

  getStyle = () => {
    return {
      color: this.color,
      fontSize: '14px',
      margin: '10px 0',
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: this.backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    };
  }

  getCloseButtonStyle = () => {
    return {
      color: this.color,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '0 5px',
      marginLeft: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: '0.7',
      transition: 'opacity 0.2s ease'
    };
  }

  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  render() {
    return (
      <div className="Alert">
        <div style={this.getStyle()}>
          <span>{this.props.text}</span>
          <button 
            onClick={this.handleClose}
            style={this.getCloseButtonStyle()}
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      </div>
    );
  }
}

class InfoAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = '#2196F3';  // Material UI Blue
    this.backgroundColor = '#E3F2FD';  // Light blue background
  }
}

class ErrorAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = '#F44336';  // Material UI Red
    this.backgroundColor = '#FFEBEE';  // Light red background
  }
}

class WarningAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = '#FF9800';  // Material UI Orange
    this.backgroundColor = '#FFF3E0';  // Light orange background
  }
}

export { InfoAlert, ErrorAlert, WarningAlert }; 