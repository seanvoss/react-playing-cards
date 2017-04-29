import React, { Component} from 'react';
import './Hand.css';
import PlayingCard from './PlayingCard/PlayingCard';
import ReactDOM from 'react-dom';

class Hand extends Component {
    constructor(props) {
            super(props);
            console.assert(Array.isArray(this.props.cards), 'Hands must have cards, even as an empty array');
            this.cardStyles = [];
            this.state = {
              cards : this.props.cards,
              cardSize : this.props.cardSize,
              elevated : this.props.elevated
            };

            //setup for fanning
            if(this.props.fan){
              this.resetFanning();
              this.styleType = this.fanStyle;
            } 
            else if(this.props.spread){
                this.resetSpread();
                this.styleType = this.spreadStyle;
            } 
    }
    elevateOne(card){

    }
    resetSpread(){
        this.initialOver = 110 * (this.state.cards.length - 1);
        this.over = this.initialOver / 2;

    }
    resetFanning(){
        this.curl = Math.pow(this.state.cards.length, 1.30) * 10; //curl of cards in hand
        this.deg = this.props.cards.length > 1 ? -this.state.cards.length * 15 : 0;
        this.degs = this.deg / 2;
        this.initialDown = this.state.cards.length * 7;
        this.down = this.initialDown / 2;
        this.initialOver = this.curl;
        this.over = this.initialOver / 2;
    }
    componentWillUpdate(){
        console.log('re-rendering: ', this.state.cards)
        if (this.props.fan) {
          this.resetFanning();
        }else if(this.props.spread){
            this.resetSpread();
        }
    }
    spreadStyle(num){

        if(num > 0){
            this.over -= this.initialOver / (this.state.cards.length - 1);
        }
        return {
            'transform' : `translateX(${(-50 + this.over * -1)}%)`
        }
    }
    fanStyle(num) {
        let overHalf = num > (this.state.cards.length - 1) / 2;
        if (false && process.env.NODE_ENV !== "production") {
            console.log('degs', this.degs);
            console.log('over', this.over);
            console.log('down', (this.overHalf ? -this.down : this.down));
            console.log('num: ', num)
        }
        if (num > 0) {
            this.degs -= this.deg / (this.state.cards.length - 1);
            this.down -= this.initialDown / (this.state.cards.length - 1);
            this.over -= this.initialOver / (this.state.cards.length - 1);
        }
        return { 'transform': `translateY(${(overHalf ? -this.down : this.down)}%) 
            translateX(${(-50 + this.over * -1)}%) 
            rotate(${this.degs}deg)` }
    }
    render() {
        let index = 0;
        console.log('rendering a hand')
        return (
        <div className={'Hand'}
          style={{ 'height': this.state.cardSize * 2, 
          'transform':'rotate(' + this.props.rotate + 'deg)'}} > 
          {
              this.state.cards.map((card) => {
                  return (
                      <PlayingCard 
                          ref={(node)=>this.cardStyles.push(node ? ReactDOM.findDOMNode(node).getBoundingClientRect() : null)}
                          key={ card }
                          height={ this.state.cardSize }
                          card={ card }
                          style={this.styleType(index++)}
                          flipped={ this.props.hide }
                          elevateOnClick={50}
                      />
                  )
              })
          }
          </div>
        )
    }
}
export default Hand;