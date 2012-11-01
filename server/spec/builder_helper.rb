module Jashboard
  module BuilderHelperUtils
    def define_attribute_names(attr)
      if attr.is_a? Hash
        class_attr_name = attr.keys.first
        builder_attr_name = attr[class_attr_name]
      else
        class_attr_name = builder_attr_name = attr
      end
      [class_attr_name.to_s, builder_attr_name.to_s]
    end
    def make_singular(attr_name)
      name = attr_name.slice(0..-2) if attr_name.end_with? "s"
      name || attr_name
    end
  end
  module BuilderHelper
    include BuilderHelperUtils
    def builder_for(object = nil)
      if object.is_a? Class
        the_instance = object.new
      elsif !object.nil?
        the_instance = object
      elsif block_given?
        the_instance = yield
      end
      define_method :initialize do
        @instance = the_instance
      end
      define_method :build do
        @instance
      end
    end
    def attr_builder(*attr_list)
      attr_list.each do |attr|
        class_attr, builder_attr = define_attribute_names(attr)
        define_method ("with_" + builder_attr).to_sym do |arg|
          @instance.instance_variable_set("@#{class_attr}", arg)
          self
        end
      end
    end
    def array_attr_builder(*attr_list)
      attr_list.each do |attr|
        class_attr, builder_attr = define_attribute_names(attr)
        define_method ("with_" + make_singular(builder_attr)).to_sym do |arg|
          variable = @instance.instance_variable_get("@#{class_attr}") || []
          @instance.instance_variable_set("@#{class_attr}", variable << arg)
          self
        end
      end
    end
    def array_hash_builder(*attr_list)
      attr_list.each do |attr|
        class_attr, builder_attr = define_attribute_names(attr)
        define_method ("with_" + builder_attr).to_sym do |key, value|
          variable = {} || @instance.instance_variable_get("@#{class_attr}")
          variable[key] = value
          @instance.instance_variable_set("@#{class_attr}", variable)
          self
        end
      end
    end
  end
end
