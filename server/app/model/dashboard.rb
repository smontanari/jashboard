module Jashboard
  class Dashboard
    attr_accessor :id, :name, :monitor_ids

    def initialize(id = nil)
      @id = id
      @monitor_ids = []
    end

    def to_json(*args)
      {id: @id, name: @name, monitor_ids: @monitor_ids}.to_json(*args)
    end
  end
end
