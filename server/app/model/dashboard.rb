module Jashboard
  class Dashboard
    attr_accessor :id, :name, :monitor_ids

    def initialize(id = nil)
      @id = id
      @monitor_ids = []
    end
  end
end
