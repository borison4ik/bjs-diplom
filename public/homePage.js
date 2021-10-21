'use strict';

// logoutButton
const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout((response) => response.success && location.reload());
};

// current Profile
ApiConnector.current((response) => ProfileWidget.showProfile(response.data));

// ratesBoard
const ratesBoard = new RatesBoard();
const updateStocksInterval = 60000;
const updateStocks = () => {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
};

updateStocks();
setInterval(updateStocks, updateStocksInterval);

// moneyManager
const moneyManager = new MoneyManager();
const mmResponseUpdate = (response, msg) => {
  if (!response.success) {
    moneyManager.setMessage(response.success, response.error);
  } else {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(response.success, msg);
  }
};
moneyManager.addMoneyCallback = (data) =>
  ApiConnector.addMoney(data, (response) =>
    mmResponseUpdate(response, 'Деньги успешно добавлены!'),
  );
moneyManager.conversionMoneyCallback = (data) =>
  ApiConnector.convertMoney(data, (response) =>
    mmResponseUpdate(response, 'Деньги успешно конвертированы!'),
  );
moneyManager.sendMoneyCallback = (data) =>
  ApiConnector.transferMoney(data, (response) =>
    mmResponseUpdate(response, 'Деньги успешно отправлены!'),
  );

// FavoritesWidget
const favoritesWidget = new FavoritesWidget();
const updateFavorites = (response, msg) => {
  if (!response.success) {
    favoritesWidget.setMessage(false, response.error);
  } else {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(true, msg);
  }
};

ApiConnector.getFavorites((response) => updateFavorites(response));

favoritesWidget.addUserCallback = (user) =>
  ApiConnector.addUserToFavorites(user, (response) =>
    updateFavorites(response, 'Пользователь успешно добавлен!'),
  );

favoritesWidget.removeUserCallback = (userId) =>
  ApiConnector.removeUserFromFavorites(userId, (response) =>
    updateFavorites(response, 'Пользователь успешно удален!'),
  );
