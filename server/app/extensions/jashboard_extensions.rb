module Jashboard
  module StructExtensions
    def to_map
      Hash.new.tap do |map|
        self.members.each { |m| map[m] = self[m] }
      end
    end
    def to_map_with_camel_case_keys 
      Hash.new.tap do |map|
        self.members.each { |m| map[m.to_s.to_camel_case] = self[m] }
      end
    end
    def to_json(*args)
      to_map.to_json(*args)
    end
  end
  module HashExtensions
    def to_struct_with_snake_keys
      snake_case_keys = self.keys.map {|k| k.to_s.to_snake_case.to_sym}
      Struct.new(*snake_case_keys).new(*self.values)
    end
    def to_struct
      keys_as_constants = self.keys.map {|k| k.to_sym}
      Struct.new(*keys_as_constants).new(*self.values)
    end
  end

  # courtesy of the extlib gem
  module StringExtensions
    def to_camel_case
      self.split('_').inject([]){ |buffer,e| buffer.push(buffer.empty? ? e : e.capitalize) }.join
    end
    def to_snake_case
      return downcase if match(/\A[A-Z]+\z/)
      gsub(/([A-Z]+)([A-Z][a-z])/, '\1_\2').
      gsub(/([a-z])([A-Z])/, '\1_\2').
      downcase
    end
  end
end

class Struct
  include Jashboard::StructExtensions
end

class Hash
  include Jashboard::HashExtensions
end

class String
  include Jashboard::StringExtensions
end
