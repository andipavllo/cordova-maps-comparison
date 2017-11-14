/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import util from '../ons/util';
import autoStyle from '../ons/autostyle';
import ModifierUtil from '../ons/internal/modifier-util';
import BaseElement from './base/base-element';
import TabbarElement from './ons-tabbar';
import contentReady from '../ons/content-ready';
import { PageLoader, defaultPageLoader } from '../ons/page-loader';

const defaultClassName = 'tabbar__item';

const scheme = {
  '': 'tabbar--*__item',
  '.tabbar__button': 'tabbar--*__button'
};

/**
 * @element ons-tab
 * @category tabbar
 * @description
 *   [en]Represents a tab inside tab bar. Each `<ons-tab>` represents a page.[/en]
 *   [ja]
 *     タブバーに配置される各アイテムのコンポーネントです。それぞれのons-tabはページを表します。
 *     ons-tab要素の中には、タブに表示されるコンテンツを直接記述することが出来ます。
 *   [/ja]
 * @codepen pGuDL
 * @tutorial vanilla/Reference/tabbar
 * @guide multiple-page-navigation
 *   [en]Managing multiple pages.[/en]
 *   [ja]Managing multiple pages[/ja]]
 * @guide templates
 *   [en]Defining multiple pages in single html[/en]
 *   [ja]複数のページを1つのHTMLに記述する[/ja]
 * @seealso ons-tabbar
 *   [en]ons-tabbar component[/en]
 *   [ja]ons-tabbarコンポーネント[/ja]
 * @seealso ons-page
 *   [en]ons-page component[/en]
 *   [ja]ons-pageコンポーネント[/ja]
 * @seealso ons-icon
 *   [en]ons-icon component[/en]
 *   [ja]ons-iconコンポーネント[/ja]
 * @example
 * <ons-tabbar>
 *   <ons-tab
 *     page="home.html"
 *     label="Home"
 *     active>
 *   </ons-tab>
 *   <ons-tab
 *     page="settings.html"
 *     label="Settings"
 *     active>
 *   </ons-tab>
 * </ons-tabbar>
 *
 * <ons-template id="home.html">
 *   ...
 * </ons-template>
 *
 * <ons-template id="settings.html">
 *   ...
 * </ons-template>

 */
export default class TabElement extends BaseElement {

  /**
   * @attribute page
   * @initonly
   * @type {String}
   * @description
   *   [en]The page that is displayed when the tab is tapped.[/en]
   *   [ja]ons-tabが参照するページへのURLを指定します。[/ja]
   */

  /**
   * @attribute icon
   * @type {String}
   * @description
   *   [en]
   *     The icon name for the tab. Can specify the same icon name as `<ons-icon>`.
   *   [/en]
   *   [ja]
   *     アイコン名を指定します。ons-iconと同じアイコン名を指定できます。
   *     個別にアイコンをカスタマイズする場合は、background-imageなどのCSSスタイルを用いて指定できます。
   *   [/ja]
   */

  /**
   * @attribute active-icon
   * @type {String}
   * @description
   *   [en]The name of the icon when the tab is active.[/en]
   *   [ja]アクティブの際のアイコン名を指定します。[/ja]
   */

  /**
   * @attribute label
   * @type {String}
   * @description
   *   [en]The label of the tab item.[/en]
   *   [ja]アイコン下に表示されるラベルを指定します。[/ja]
   */

  /**
   * @attribute badge
   * @type {String}
   * @description
   *   [en]Display a notification badge on top of the tab.[/en]
   *   [ja]バッジに表示する内容を指定します。[/ja]
   */

  /**
   * @attribute active
   * @description
   *   [en]This attribute should be set to the tab that is active by default.[/en]
   *   [ja][/ja]
   */

  constructor() {
    super();

    if (['label', 'icon', 'badge'].some(this.hasAttribute.bind(this))) {
      this._compile();
    } else {
      contentReady(this, () => this._compile());
    }

    this._pageLoader = defaultPageLoader;
    this._boundOnClick = this._onClick.bind(this);
  }

  set pageLoader(loader) {
    if (!(loader instanceof PageLoader)) {
      throw Error('First parameter must be an instance of PageLoader.');
    }
    this._pageLoader = loader;
  }

  get pageLoader() {
    return this._pageLoader;
  }

  _compile() {
    autoStyle.prepare(this);
    this.classList.add(defaultClassName);

    if (this._button) {
      return;
    }

    const button = util.create('button.tabbar__button');
    while(this.childNodes[0]) {
      button.appendChild(this.childNodes[0]);
    }

    const input = util.create('input', { display: 'none' });
    input.type = 'radio';

    this.appendChild(input);
    this.appendChild(button);

    this._updateButtonContent();
    ModifierUtil.initModifier(this, scheme);
    this._updateRipple();
  }

  _updateRipple() {
    this._button && util.updateRipple(this._button, this.hasAttribute('ripple'));
  }

  _updateButtonContent() {
    const button = this._button;

    let iconWrapper = this._icon;
    if (this.hasAttribute('icon')) {
      iconWrapper = iconWrapper || util.createElement('<div class="tabbar__icon"><ons-icon></ons-icon></div>');
      const icon = iconWrapper.children[0];
      const lastIconName = icon.getAttribute('icon');
      icon.setAttribute('icon', this.getAttribute('icon'));
      iconWrapper.parentElement !== button && button.insertBefore(iconWrapper, button.firstChild);
      // dirty fix for https://github.com/OnsenUI/OnsenUI/issues/1654
      icon.attributeChangedCallback('icon', lastIconName, this.getAttribute('icon'));
    } else {
      iconWrapper && iconWrapper.remove();
    }

    ['label', 'badge'].forEach((attr, index) => {
      let prop = this.querySelector(`.tabbar__${attr}`);
      if (this.hasAttribute(attr)) {
        prop = prop || util.create(`.tabbar__${attr}` + (attr === 'badge' ? ' notification' : ''));
        prop.textContent = this.getAttribute(attr);
        prop.parentElement !== button && button.appendChild(prop);
      } else {
        prop && prop.remove();
      }
    });
  }

  get _input() {
    return util.findChild(this, 'input');
  }

  get _button() {
    return util.findChild(this, '.tabbar__button');
  }

  get _icon() {
    return this.querySelector('.tabbar__icon');
  }

  get _tabbar() {
    return util.findParent(this, 'ons-tabbar');
  }

  get index() {
    return Array.prototype.indexOf.call(this.parentElement.children, this);
  }

  _onClick() {
    if (this.onClick instanceof Function) {
      this.onClick();
    } else {
      this._tabbar.setActiveTab(this.index, { reject: false });
    }
  }

  setActive(active = true) {
    this._input.checked = active;
    this.classList.toggle('active', active);
    util.toggleAttribute(this, 'active', active)

    if (this.hasAttribute('icon') && this.hasAttribute('active-icon')) {
      this._icon.children[0].setAttribute('icon', this.getAttribute(active ? 'active-icon' : 'icon'));
    }
  }

  _loadPageElement(parent, page) {
    this._hasLoaded = true;
    return new Promise(resolve => {
      this._pageLoader.load({ parent, page }, pageElement => {
        parent.replaceChild(pageElement, parent.children[this.index]); // Ensure position
        this._loadedPage = pageElement;
        resolve(pageElement);
      });
    });
  }

  get pageElement() {
    // It has been loaded by ons-tab
    if (this._loadedPage) {
      return this._loadedPage;
    }
    // Manually attached to DOM, 1 per tab
    const tabbar = this._tabbar;
    if (tabbar.pages.length === tabbar.tabs.length) {
      return tabbar.pages[this.index];
    }
    // Loaded in another way
    return null;
  }

  /**
   * @return {Boolean}
   */
  isActive() {
    return this.classList.contains('active');
  }

  disconnectedCallback() {
    this.loaded = null;
    this.removeEventListener('click', this._boundOnClick, false);
    if (this._loadedPage) {
      this._pageLoader.unload(this._loadedPage);
      this._loadedPage = null;
      this._hasLoaded = false;
    }
  }

  connectedCallback() {
    if (!util.isAttached(this) || this.loaded) {
      return; // ons-tabbar compilation may trigger this
    }

    const deferred = util.defer();
    this.loaded = deferred.promise;

    contentReady(this, () => {
      const index = this.index;
      const tabbar = this._tabbar;
      if (!tabbar) {
        throw new Error('This ons-tab element must be child of ons-tabbar element.');
      }

      if (tabbar.hasAttribute('modifier')) {
        util.addModifier(this, tabbar.getAttribute('modifier'));
      }

      if (!this._hasLoaded) {
        if (this.hasAttribute('active')) {
          this.setActive(true);
          tabbar.setAttribute('activeIndex', index);
        }

        if (index === tabbar.tabs.length - 1) {
          tabbar._onRefresh();
          setImmediate(() => tabbar._onRefresh());
        }

        TabbarElement.rewritables.ready(tabbar, () => {
          const pageTarget = this.page || this.getAttribute('page');
          if (!this.pageElement && pageTarget) {
            const parentTarget = tabbar._targetElement;
            const dummyPage = util.create('div', { height: '100%', width: '100%', backgroundColor: 'transparent' });
            parentTarget.insertBefore(dummyPage, parentTarget.children[index]); // Ensure position
            return this._loadPageElement(parentTarget, pageTarget).then(deferred.resolve)
          }

          return deferred.resolve(this.pageElement);
        });
      }

      this.addEventListener('click', this._boundOnClick, false);
    });
  }

  static get observedAttributes() {
    return ['modifier', 'ripple', 'icon', 'label', 'page', 'badge', 'class'];
  }

  attributeChangedCallback(name, last, current) {
    switch (name) {
      case 'class':
        util.restoreClass(this, defaultClassName, scheme);
        break;
      case 'modifier':
        contentReady(this, () => ModifierUtil.onModifierChanged(last, current, this, scheme));
        break;
      case 'ripple':
        contentReady(this, () => this._updateRipple());
        break;
      case 'icon':
      case 'label':
      case 'badge':
        contentReady(this, () => this._updateButtonContent());
        break;
      case 'page':
        this.page = current || '';
        break;
    }
  }
}

customElements.define('ons-tab', TabElement);
