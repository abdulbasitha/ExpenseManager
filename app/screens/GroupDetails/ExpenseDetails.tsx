import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { Avatar, Button, ProgressBar } from 'react-native-paper';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import metrics from 'app/config/metrics';

import { useDispatch, useSelector } from 'react-redux';
import { updateExpenseStatus } from 'app/store/actions/expenseActions';

export default function ExpenseDetails() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  // route.params?.groupDetails
  const { _id, owner_id, members, amount, expense_name, group_id, created_at } =
    useSelector(state => state.expenseReducer.ExpenseList)?.find(
      e => e._id == route.params?.groupDetails._id,
    );
  const userId = useSelector((state: any) => state.loginReducer.id);
  const nonPaidCount = members?.filter(e => e.payment_status == false)?.length;
  const paidAmount =
    Math.round(
      (amount / members.length) * (members.length - nonPaidCount) * 100,
    ) / 100;
  const leftAmount = Math.round((amount - paidAmount) * 100) / 100;
  const amountPerHead = Math.round((amount / members.length) * 100) / 100;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Expense : ' + expense_name,
      headerLeft: () => (
        <Button mode="text" color="#007AFF" onPress={() => navigation.goBack()}>
          Back
        </Button>
      ),
    });
    navigation.setOptions({ headerRight: null });
  });

  const setMarkAsPaid = (user: any) => {
    Alert.alert(
      'Warning',
      `Do you want to make as ${
        user.payment_status == true ? 'unpaid' : 'paid'
      }?`,
      [
        { text: 'NO', onPress: () => null, style: 'cancel' },
        {
          text: 'YES',
          onPress: () =>
            dispatch(
              updateExpenseStatus(
                _id,
                user.user_id,
                !user.payment_status,
                owner_id,
                group_id,
              ),
            ),
        },
      ],
    );
  };

  const _renderUsers = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (owner_id == userId ? setMarkAsPaid(item) : {})}>
        <View style={styles.membersItemContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={styles.membersItem}>
              <View style={styles.avatharContainer}>
                {item.payment_status == true && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={colors.text}
                    style={styles.avatharCheck}
                  />
                )}
                <Avatar.Text
                  size={40}
                  label={item?.name?.substring(0, 2).toUpperCase()}
                  color="white"
                />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text style={[styles.membersName, { color: colors.text }]}>
                  {userId == item?.user_id ? 'You' : item.name}
                </Text>
                <Text style={styles.membersStatus}>
                  {item?.payment_status == true ? 'paid' : 'unpaid'}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.paymentleftStatus}>₹ {amountPerHead} </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsViewAvathar}>
        <Avatar.Text
          size={50}
          label={expense_name.substring(0, 2).toUpperCase()}
          color="white"
        />
        <View style={{ padding: 17, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: colors.text }}>
            Total: ₹{amount}{' '}
          </Text>
          {nonPaidCount == 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
              }}>
              <Text style={{ fontSize: 14, color: colors.text }}>
                Completed{' '}
              </Text>
              <MaterialCommunityIcons
                name="check-circle"
                size={15}
                color={colors.green}
              />
            </View>
          )}
        </View>

        <View style={{ flex: 0, paddingBottom: 5 }}>
          <ProgressBar
            progress={(members.length - nonPaidCount) / members.length}
            color={'#007AFF'}
            style={{ height: 10, width: metrics.screenWidth / 1.5 }}
          />
          <View style={[styles.expenseViewDetails, {}]}>
            <Text style={[styles.paymentStatus]}>
              {members && `₹ ${paidAmount} paid`}
            </Text>
            <Text style={styles.paymentleftStatus}>₹ {leftAmount} left</Text>
          </View>
        </View>
      </View>
      <View style={styles.membersContainer}>
        <Text style={[styles.paidStatusLabel, { color: colors.text }]}>
          {' '}
          {members &&
            ` ${members.length - nonPaidCount} of ${members.length} paid`}{' '}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={members}
          renderItem={_renderUsers}
          keyExtractor={user => user.user_id}
          ListFooterComponent={
            <View style={{ height: 0, marginBottom: 190 }}></View>
          }
        />
      </View>
    </View>
  );
}
