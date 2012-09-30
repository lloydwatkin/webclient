/*
 * Copyright 2012 Denis Washington <denisw@online.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var avatarFallback = require('util/avatarFallback');
  var Preferences = require('models/Preferences');
  var template = require('text!templates/content/preferences.html');

  var PreferencesView = Backbone.View.extend({
    className: 'stream clearfix',

    events: {
      'click .save': 'save',
      'click .discard': '_renderCheckboxes',
      'click .twoStepConfirmation .stepOne': '_renderConfirmButton',
      'click .twoStepConfirmation .stepTwo': '_deleteAccount'
    },

    initialize: function() {
      this.checkboxes = 
        {
          'newFollowers': 'followMyChannel',
          'mentions': 'postMentionedMe',
          'ownChannel': 'postOnMyChannel',
          'followedChannels': 'postOnSubscribedChannel',
          'threads': 'postAfterMe' 
        };
      this.model = new Preferences();
      this.model.bind('change', this.render, this);
      this.model.fetch({credentials: this.options.user.credentials});
    },

    render: function() {
      this.$el.html(_.template(template, {
        preferences: this.model
      }));

      this._renderCheckboxes();
    },

    _renderCheckboxes: function() {
      self = this;
      _.each(_.keys(this.checkboxes), function(checkbox) {
        self._check($('#' + checkbox), self.model[checkbox]());
      });
    },

    _renderConfirmButton: function() {
      $('.twoStepConfirmation').toggleClass('confirmed');
    },

    _deleteAccount: function() {
      //TODO delete account
    },

    save: function(event) {
      var email = $('#email_address').val();

      if (email) {
        this._savePreferences(email);
      }
    },

    _savePreferences: function(email) {
      self = this;
      _.each(_.keys(this.checkboxes), function(checkbox) {
        self.model.set(self.checkboxes[checkbox], 
          self._isChecked($('#' + checkbox)));
      });

      this.model.save({}, {credentials: this.options.user.credentials});
    },

    _check: function(element, value) {
      if (element) {
        element.attr('checked', value);
      }
    },

    _isChecked: function(element) {
      if (element) {
        var checked = element.attr('checked');
        if (checked && checked === 'checked') {
          return 'true';
        }
      }

      return 'false';
    }
  });

  return PreferencesView;
});