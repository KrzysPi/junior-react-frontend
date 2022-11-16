import React, { Component } from "react";
import DataContext from "../context/DataContext";
import { withParams } from "../higherOrderComponents/withParams.js";
import { withNavigation } from "../higherOrderComponents/withNavigation.js";
import { ReactComponent as CartIcon } from "../assets/svg/emptyCart.svg";
import { ProductInCart } from "./ProductInCart";
import SubmitButton from "./SubmitButton";

export class DropdownCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };

    // this.wrapperRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  myRef = React.createRef();

  handleClickOutside = (e) => {
    if (!this.myRef?.current?.contains(e.target)) {
      this.setState({ showMenu: false });
    }
  };

  handleIconClick = (e) => {
    e.stopPropagation();
    this.setState({ showMenu: true });
  };

  render() {
    const { selectedCurrency, productsInBasket, totalBasketPrice } =
      this.context;
    const { options } = this.props;

    return (
      <div className="dropdown-cart-container">
        <div>
          <CartIcon
            onClick={this.handleIconClick}
            style={{ width: "1,25rem", height: "1.125rem", cursor: "pointer" }}
          />
          {productsInBasket.length > 0 && (
            <span className="cart-count">{productsInBasket.length}</span>
          )}
        </div>

        {this.state.showMenu && (
          <div className="dropdown-cart-dim-background">
            <div className="dropdown-cart-card-menu" ref={this.myRef}>
              <div className="dropdown-cart-main-info">
                My Bag,
                <span>
                  {` ${productsInBasket.length} ${
                    productsInBasket.length > 1 ? "items" : "item"
                  }`}
                </span>
              </div>
              {productsInBasket
                .filter(
                  (item, index, arr) =>
                    arr
                      .map((product) => product["productId"])
                      .indexOf(item["productId"]) === index
                )
                .map((item, index) => (
                  <ProductInCart
                    key={`${index}-${item.productId}`}
                    productInCart={item}
                    showMenu={this.state.showMenu}
                  />
                ))}
              <div className="dropdown-cart-total-price-wrap">
                <p>Total</p>
                <p className="dropdown-cart-total-price-value">
                  {selectedCurrency.symbol + totalBasketPrice}
                </p>
              </div>
              <div className="dropdown-cart-buttons-wrap">
                <SubmitButton
                  className="dropdown-cart-button-view-bag"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.navigate(`/cart`);
                    this.setState({ showMenu: false });
                  }}
                  placeholder={"VIEW BAG"}
                ></SubmitButton>
                <SubmitButton
                  className="dropdown-cart-button-check-out"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.navigate(`/checkout`);
                    this.setState({ showMenu: false });
                  }}
                  placeholder={"CHECK OUT"}
                ></SubmitButton>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

DropdownCart.contextType = DataContext;

export default withNavigation(withParams(DropdownCart));
