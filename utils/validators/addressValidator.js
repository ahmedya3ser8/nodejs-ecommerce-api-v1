import { check } from "express-validator";

import validator from '../../middlewares/validator.js';

const addAddressValidator = [
  check('alias')
    .notEmpty().withMessage('Address Alias is required')
    .custom((alias, { req }) => {
      if (req.body.alias) {
        const aliasExist = req.user.addresses.some((address) => address.alias.toLowerCase() === alias.toLowerCase());
        if (aliasExist) {
          throw new Error('Address alias already exists');
        }
        return true;
      }
    }),
  check('details')
    .notEmpty().withMessage('Address Details is required'),
  check('phoneNumber')
    .notEmpty().withMessage('PhoneNumber is required')
    .isMobilePhone('ar-EG').withMessage('Invalid Egyptian phone number'),
  check('city')
    .notEmpty().withMessage('City is required'),
  check('postalCode')
    .notEmpty().withMessage('PostalCode is required')
    .matches(/^\d{5}$/)
    .withMessage('Postal code must be exactly 5 digits'),
  validator
];

const removeAddressValidator = [
  check('addressId')
    .notEmpty().withMessage('Address Id is required')
    .isMongoId().withMessage('Invalid Address Id format')
    .custom((addressId, { req }) => {
      const exists = req.user.addresses.some((address) => address._id.toString() === addressId);
      if (!exists) {
        throw new Error('Address not found');
      }
      return true;
    }),
  validator
]

export {
  addAddressValidator,
  removeAddressValidator
}
