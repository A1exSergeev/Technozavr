export default function getColorCode(value) {
	return value == 'Черный' ? '#000000' :
	value == 'Серый' ? '#939393' :
	value == 'Красный' ? '#ff0000' :
	value == 'Зеленый' ? '#8be000' :
	value == 'Оранжевый' ? '#ff6b00' : '';
}