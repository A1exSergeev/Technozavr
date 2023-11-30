export default function endingCountProducts(value) {
	return value.toString().slice(-1) == '1' ? 'товар' :
	value >= 2 && value <= 4 ? 'товара' : 'товаров';
}
