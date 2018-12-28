using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Keyboard.Avoid.Manager.RNKeyboardAvoidManager
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNKeyboardAvoidManagerModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNKeyboardAvoidManagerModule"/>.
        /// </summary>
        internal RNKeyboardAvoidManagerModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNKeyboardAvoidManager";
            }
        }
    }
}
