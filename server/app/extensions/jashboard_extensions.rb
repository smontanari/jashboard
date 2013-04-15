module Jashboard
  module StructExtensions
    def to_map
      Hash.new.tap do |map|
        self.members.each { |m| map[m] = self[m] }
      end
    end
    def to_json(*args)
      to_map.to_json(*args)
    end
  end
  module HashExtensions
    def to_struct
      keys_as_constants = self.keys.map {|k| k.to_sym}
      Struct.new(*keys_as_constants).new(*self.values)
    end
  end
end

class Struct
  include Jashboard::StructExtensions
end

class Hash
  include Jashboard::HashExtensions
end