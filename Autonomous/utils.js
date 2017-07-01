/**
 * Utils for Autonomous component.
 * 
 * @author: Andy
 * @time: 2017-06-28
 */

module.exports = {
    // Binding `this` in a convenient way.
    bindFunctions: function (functions) {
        functions.forEach(f => (this[f] = this[f].bind(this)));
    },

    /**
     * Update source data.
     * 
     * @param {String} id: field to handle.
     * @param {Function} processor: handler for specified field.
     */
    updateSource: function (id, processor) {

        // Get previous data from props.
        let data = Object.assign({}, this.props.data);
        let fields = data.fields;

        // Get current fields' value from antd form.
        let vals = this.props.form.getFieldsValue();

        for(let [k, v] of Object.entries(vals)) {
            fields[k].value = v;
        }
        
        // Handle specified field.
        processor(fields[id]);

        // Trigger parent component's `onUpdate` callback with processed data.
        this.props.onUpdate(data);
    }
}