require 'fsdb'
require 'uuidtools'
require 'yaml'
require 'model/dashboard'
require 'model/build_monitor'

module Jashboard
  class FileRepository
    DASHBOARD_NAMESPACE = "dashboard"
    MONITOR_NAMESPACE = "monitor"
    def initialize
      env = ENV['JASHBOARD_ENV'] || 'development'
      @db = FSDB::Database.new("db/#{env}")
    end

    def load_dashboards
      @db[DASHBOARD_NAMESPACE].map {|id| YAML.load(@db["#{DASHBOARD_NAMESPACE}/#{id}"])}
    end

    def load_monitor(monitor_id)
      YAML.load(@db["#{MONITOR_NAMESPACE}/#{monitor_id}.txt"])
    end

    def save_dashboard(dashboard)
      save(dashboard, DASHBOARD_NAMESPACE)
    end

    def save_monitor(monitor)
      save(monitor, MONITOR_NAMESPACE)
    end

    private

    def save(object, namespace)
      object.id = UUIDTools::UUID.random_create if (object.id.nil?)
      @db["#{namespace}/#{object.id}.txt"] = YAML.dump(object)
      object
    end
  end
end
