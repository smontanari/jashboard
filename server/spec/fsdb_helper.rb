module Jashboard
  class FSDBHelper
    def initialize(db_path)
      @db_path = db_path
    end

    def clean_data
      FileUtils.rm Dir.glob("#{@db_path}/**/*.txt")
      FileUtils.rm Dir.glob("#{@db_path}/**/..fsdb.meta.*.txt")
    end

    def method_missing(method, args, &block)
      match = method.to_s.match(/(serialize|validate)_(monitor|dashboard)/)
      super(method, args) if match.nil?
      self.send("#{match[1]}_yaml".to_sym, "#{match[2]}", args, &block)
    end

    private

    def serialize_yaml(base_path, obj)
      File.open("#{@db_path}/#{base_path}/#{obj.id}.txt", "w") do |f|
        f.write(YAML.dump(obj))
      end
    end

    def validate_yaml(base_path, id)
      obj = YAML.load_file("#{@db_path}/#{base_path}/#{id}.txt")
      yield(obj) if block_given?
      obj
    end
  end
end