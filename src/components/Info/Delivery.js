import React, {Component} from 'react';
import {Card, Accordion, Table} from 'react-bootstrap';
import Cross from '../../assets/images/cross.svg';

class Delivery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderId: 'N/A',
      status: 'N/A',
      customerName: 'N/A',
      vendorName: 'N/A',
      date: 'N/A',
      logo: false
    }


    this.closeInfo = this.closeInfo.bind(this);
  }

  closeInfo = () => {
    this.props.resetPoint();
  }

  render() {
    const {logo} = this.state;

    return (
      <div className={`device-info popup-list device-info-colapse`}>

          {logo ? (
            <div className="device-title delivery-img">
              <h5><img src={logo} alt="info"/> Order List</h5>
             </div>
           ) : (
              <div className="device-title">
                {/* <img src={DeviceInfo} alt="info" height="20" width="20"/>  */}
                <h5>Order List</h5>
              </div>
           )
          }
          <button className="cross dirvers-detail" onClick={this.closeInfo}>
            <img src={Cross} alt="cross"/>
          </button>

        <div className="device_info-details">
          <Accordion className="order__accord" activeKey={this.props.searchkey}>
         {this.props.orderList !== null && this.props.orderList.map(d => {
          return (
            <Card key={d.order_id}>
              <Accordion.Toggle as={Card.Header} eventKey={d.order_id}>
                <div className="order__block">
                  <div className="orderblock__left">
                    <img src={d.vendor_logo} alt="order"/>
                  </div>
                  <div className="orderblock__mid">
                    <span className="order__numb">{d.order_number}</span>
                  </div>
                  <div className="orderblock__right">
                    {d.orderstatus === 'Processing' && <span className="order__stat__accepted">{d.orderstatus}</span>}
                    {d.orderstatus === 'Order Accepted' && <span className="order__stat__accepted">{d.orderstatus}</span>}
                    {d.orderstatus === 'Picked up' && <span className="order__stat__blue">{d.orderstatus}</span>}
                    {d.orderstatus === 'Acknowledged' && <span className="order__stat__accepted">{d.orderstatus}</span>}
                    {d.orderstatus === 'Restaurant Reached' && <span className="order__stat__accepted">{d.orderstatus}</span>}
                    {d.orderstatus === 'Delivered' && <span className="order__stat__green">{d.orderstatus}</span>}
                  </div>
                </div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={d.order_id}>
                <Card.Body>
                  <p className="mb-0"><span className="card__text-strong">{d.vendor_name},</span> {d.vendor_address}</p>
                  <p className="mb-0">( {d.customer_phone_number} )</p>

                  <div className="order__table">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td className="relative__cell"><span className="table__colon2">:</span>Delivery Time</td>
                          <td>{d.delivery_date_time}</td>
                        </tr>
                        <tr>
                          <td className="relative__cell"><span className="table__colon2">:</span>Customer</td>
                          <td>{d.customer_name}</td>
                        </tr>
                        <tr>
                          <td className="relative__cell"><span className="table__colon2">:</span>Customer No.</td>
                          <td>{d.customer_phone_number}</td>
                        </tr>
                        <tr>
                          <td className="relative__cell"><span className="table__colon2">:</span>Address</td>
                          <td>N/A</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            )
                  })
                }
          </Accordion>
        </div>
      </div>
    );
  }
}

export default Delivery;