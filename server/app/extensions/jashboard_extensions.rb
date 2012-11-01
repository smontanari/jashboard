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
end

class Struct
  include Jashboard::StructExtensions
end
