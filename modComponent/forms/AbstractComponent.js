/*
 * This file is part of the Servoy Business Application Platform, Copyright (C) 2012-2013 Servoy BV 
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * Base definition for the different AbstractComponent$.... impl. 
 */

/*
 * Component lifecycle events
 */
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5D664A6D-50CC-4FA6-A705-010EC67B7968"}
 */
function onLoad(event) {
	addJavaScriptDependancy('media:///modComponent/modComponent.js')
	addJavaScriptDependancy('media:///modComponent/modComponentCallback.js')
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"1E8A55E2-33F6-46F8-B992-AC2DB8137BB5"}
 */
function onShow(firstShow, event) {}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"16848B6D-636F-4CD0-A374-32F8B80DA8E7"}
 */
function onHide(event) {
	return true
}

/**
 * Callback method when form is destroyed.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"58E0CB8B-3692-4F6A-B9D4-41BBF2833A71"}
 */
function onUnload(event) {
}

/**
 * Callback method when form is resized.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"606F5952-548E-46D5-BEB2-1C16E81C9B86"}
 */
function onResize(event) {
}

/*
 * Component persistance API
 */
/**
 * @abstract
 * @param {{id: String}} object
 * @param {String} [incrementalUpdateCode]
 *
 * @properties={typeid:24,uuid:"639FBDF8-D88F-4D9F-A04B-3CAB322AA350"}
 */
function persistObject(object, incrementalUpdateCode) {
	throw new scopes.modUtils$exceptions.AbstractMethodInvocationException('Abstract method persistObject() must be implemented on instances of AbstractComponent');
}

/**
 * @abstract
 * @param {String} id
 *
 * @properties={typeid:24,uuid:"D855B7DA-E66B-46D6-8FE7-404FC27C2911"}
 */
function desistObject(id) {
	throw new scopes.modUtils$exceptions.AbstractMethodInvocationException('Abstract method desistObject() must be implemented on instances of AbstractComponent');
}

/**
 * To check whether or not to execute the incremental update code
 * @abstract
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"42E6B78D-98A1-4FFF-A0A2-CC974CD46BCD"}
 */
function isRendered() {
	return false;
}

/**
 * Returns the UUID by which to refer to this Component instance
 * @final
 * @return {String}
 * 
 * @properties={typeid:24,uuid:"83DBC63F-DADD-4AE0-AE17-0B6F933F79B7"}
 */
function getId() {
	return controller.getName()
}

/**
 * Abstract identifier, should be overridden on implementations of AbstractComponent and return the id under which all browser interaction takes place
 * @abstract
 * @protected 
 * TODO: write UnitTest to check for this implementation
 * @properties={typeid:24,uuid:"9D9DA2C9-A017-47B8-A4A4-B7C9BF425550"}
 */
function getComponentId(){
	throw new scopes.modUtils$exceptions.AbstractMethodInvocationException('Abstract method getComponentId() must be implemented on instances of AbstractComponent');
}

/**
 * Internal API: DO NOT CALL
 * @param {Object} o
 * @return {String}
 * @properties={typeid:24,uuid:"416C6366-18A1-4691-8812-AA824E5F4B59"}
 */
function serializeObject(o) {
	return JSON.stringify(o, function(key, value) {
		if (typeof value === 'string') {
			return escape(value)
		}
		return value
	})
}

/*
 * Component interaction API
 */
/**
 * TODO refactor to executeScript
 * @abstract
 * @properties={typeid:24,uuid:"3DA12669-19E2-4015-B9F1-0D593797C1E8"}
 */
function executeClientsideScript(script) {
	throw new scopes.modUtils$exceptions.AbstractMethodInvocationException('Abstract method executeClientsideScript() must be implemented on instances of AbstractComponent');
}

/**
 * @abstract
 * @param {String} url
 *
 * @properties={typeid:24,uuid:"1FBEAB33-6C34-4FF6-BE2F-38A7597CC7E0"}
 */
function addJavaScriptDependancy(url) {	
	throw new scopes.modUtils$exceptions.AbstractMethodInvocationException('Abstract method addJavaScriptDependancy() must be implemented on instances of AbstractComponent');
}

/**
 * @abstract
 * @param {String} url
 *
 * @properties={typeid:24,uuid:"CBCAF7EB-7AF2-46F0-A9C2-7E0D4C8688B9"}
 */
function addCSSDependancy(url) {	
	throw new scopes.modUtils$exceptions.AbstractMethodInvocationException('Abstract method addCSSDependancy() must be implemented on instances of AbstractComponent');
}