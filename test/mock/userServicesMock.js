/**
 * Created by jimmy on 11/11/13.
 */
'use strict';

angular.module('mockedUserServices', [])
  .value('postUsers', {
    user: {
      '_id': '123',
      'user': 'user',
      'user name': 'user name'
    }
  });